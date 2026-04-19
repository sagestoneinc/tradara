import type { SignalAiEnrichment, SignalInputSnapshot, SignalSnapshot } from "@tradara/shared-types";
import { isoNow } from "@tradara/shared-utils";

import { AiSignalAnalystService } from "../ai/ai-signal-analyst.service";
import type { SignalInputRepository, SignalRepository } from "../../repositories/types";
import { DomainError } from "../../lib/domain-error";

export class SignalScoringService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly signalInputRepository: SignalInputRepository,
    private readonly aiSignalAnalyst: AiSignalAnalystService,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async enrichDraft(signalId: string): Promise<{ signal: SignalSnapshot; enrichment: SignalAiEnrichment }> {
    const signal = await this.signalRepository.findById(signalId);
    if (!signal) {
      throw new DomainError("Signal not found.", 404, "signal_not_found");
    }

    if (signal.status !== "draft") {
      throw new DomainError("Only draft signals can be enriched.", 409, "invalid_signal_state");
    }

    const signalInput = await this.signalInputRepository.findById(signal.signalInputId);
    if (!signalInput) {
      throw new DomainError("Signal input not found.", 404, "signal_input_not_found");
    }

    const enrichment = await this.aiSignalAnalyst.analyze(this.mapInput(signalInput));
    const aiScored: SignalSnapshot = {
      ...signal,
      status: "ai_scored",
      confidenceScore: enrichment.confidenceScore,
      setupQualityScore: enrichment.confidenceBreakdown.setupQualityScore,
      riskLabel: enrichment.riskLabel,
      invalidationSummary: enrichment.invalidationSummary,
      setupRationale: enrichment.rationale,
      marketContext: enrichment.marketContext,
      warnings: enrichment.warnings,
      confidenceBreakdown: enrichment.confidenceBreakdown.breakdown
        ? {
            ...enrichment.confidenceBreakdown.breakdown,
            weightedPositiveScore: enrichment.confidenceBreakdown.weightedPositiveScore,
            finalScore: enrichment.confidenceBreakdown.finalScore
          }
        : signal.confidenceBreakdown,
      telegramDraft: enrichment.telegramDraft,
      metadata: {
        ...signal.metadata,
        aiEnrichment: enrichment
      },
      updatedAt: isoNow(this.clock())
    };

    const pendingReview: SignalSnapshot = {
      ...aiScored,
      status: "pending_review",
      updatedAt: isoNow(this.clock())
    };

    await this.signalRepository.save(aiScored);
    await this.signalRepository.save(pendingReview);

    return {
      signal: pendingReview,
      enrichment
    };
  }

  private mapInput(input: SignalInputSnapshot) {
    return {
      sourceType: input.sourceType,
      sourceProvider: input.sourceProvider,
      sourceEventId: input.sourceEventId,
      symbol: input.symbol,
      timeframe: input.timeframe,
      direction: input.direction,
      entryZoneLow: input.entryZoneLow,
      entryZoneHigh: input.entryZoneHigh,
      stopLoss: input.stopLoss,
      takeProfit1: input.takeProfit1,
      takeProfit2: input.takeProfit2,
      takeProfit3: input.takeProfit3,
      marketPrice: input.marketPrice,
      trendAlignment: input.trendAlignment,
      structureQuality: input.structureQuality,
      volatilityQuality: input.volatilityQuality,
      liquidityQuality: input.liquidityQuality,
      riskRewardQuality: input.riskRewardQuality,
      conflictPenalty: input.conflictPenalty,
      note: input.note,
      strategyName: input.strategyName,
      detectedAt: input.detectedAt,
      metadata: input.metadata
    };
  }
}
