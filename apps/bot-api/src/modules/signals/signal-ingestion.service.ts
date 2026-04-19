import type { CreateSignalInputRequest, SignalInputSnapshot, SignalSnapshot } from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import type { SignalInputRepository, SignalRepository } from "../../repositories/types";

export class SignalIngestionService {
  constructor(
    private readonly signalInputRepository: SignalInputRepository,
    private readonly signalRepository: SignalRepository,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async createDraft(input: CreateSignalInputRequest): Promise<{
    signalInput: SignalInputSnapshot;
    signal: SignalSnapshot;
  }> {
    const now = isoNow(this.clock());
    const signalInput: SignalInputSnapshot = {
      id: createId("signal_input"),
      sourceType: input.sourceType,
      sourceProvider: input.sourceProvider ?? null,
      sourceEventId: input.sourceEventId ?? null,
      symbol: input.symbol,
      timeframe: input.timeframe ?? null,
      direction: input.direction ?? null,
      entryZoneLow: input.entryZoneLow ?? null,
      entryZoneHigh: input.entryZoneHigh ?? null,
      stopLoss: input.stopLoss ?? null,
      takeProfit1: input.takeProfit1 ?? null,
      takeProfit2: input.takeProfit2 ?? null,
      takeProfit3: input.takeProfit3 ?? null,
      marketPrice: input.marketPrice ?? null,
      trendAlignment: input.trendAlignment ?? null,
      structureQuality: input.structureQuality ?? null,
      volatilityQuality: input.volatilityQuality ?? null,
      liquidityQuality: input.liquidityQuality ?? null,
      riskRewardQuality: input.riskRewardQuality ?? null,
      conflictPenalty: input.conflictPenalty ?? null,
      note: input.note ?? null,
      strategyName: input.strategyName ?? null,
      detectedAt: input.detectedAt ?? null,
      metadata: input.metadata ?? {},
      createdAt: now,
      updatedAt: now
    };

    const signal: SignalSnapshot = {
      id: createId("signal"),
      signalInputId: signalInput.id,
      status: "draft",
      sourceType: input.sourceType,
      confidenceScore: null,
      setupQualityScore: null,
      riskLabel: null,
      invalidationSummary: null,
      setupRationale: null,
      marketContext: null,
      warnings: [],
      confidenceBreakdown: {
        trendAlignment: 0,
        structureQuality: 0,
        volatilityQuality: 0,
        liquidityQuality: 0,
        riskRewardQuality: 0,
        conflictPenalty: 0,
        weightedPositiveScore: 0,
        finalScore: 0
      },
      telegramDraft: null,
      expertReviewNotes: null,
      editedTelegramDraft: null,
      publishedTelegramText: null,
      publishedTelegramChatId: null,
      publishedTelegramMessageId: null,
      approvedBy: null,
      approvedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      publishedBy: null,
      publishedAt: null,
      canceledAt: null,
      metadata: {},
      createdAt: now,
      updatedAt: now
    };

    await this.signalInputRepository.save(signalInput);
    await this.signalRepository.save(signal);

    return { signalInput, signal };
  }
}
