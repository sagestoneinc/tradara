import type {
  AdminSignalsData,
  MarketInsightSnapshot,
  SignalSnapshot
} from "@tradara/shared-types";
import { isoNow } from "@tradara/shared-utils";

import type { MarketInsightRepository, SignalRepository } from "../../repositories/types";

export class SignalAdminReadService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly marketInsightRepository: MarketInsightRepository,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async getReviewQueue(): Promise<SignalSnapshot[]> {
    return this.filterSignalsByStatus("pending_review");
  }

  async getPublishedSignals(): Promise<SignalSnapshot[]> {
    return this.filterSignalsByStatus("published");
  }

  async getApprovedSignals(): Promise<SignalSnapshot[]> {
    const signals = await this.signalRepository.listAll();
    return signals
      .filter((signal) => signal.status === "approved" || signal.status === "edited")
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getRejectedSignals(): Promise<SignalSnapshot[]> {
    return this.filterSignalsByStatus("rejected");
  }

  async getWatchlistSignals(): Promise<SignalSnapshot[]> {
    return this.filterSignalsByStatus("watchlist");
  }

  async getMarketInsights(): Promise<MarketInsightSnapshot[]> {
    const insights = await this.marketInsightRepository.listAll();
    return insights.sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  async getAdminSignalsData(): Promise<AdminSignalsData> {
    const signals = await this.signalRepository.listAll();

    return {
      generatedAt: isoNow(this.clock()),
      metrics: {
        drafts: signals.filter((signal) => signal.status === "draft").length,
        pendingReview: signals.filter((signal) => signal.status === "pending_review").length,
        published: signals.filter((signal) => signal.status === "published").length,
        rejected: signals.filter((signal) => signal.status === "rejected").length
      },
      rows: signals.map((signal) => ({
        id: signal.id,
        contentType: "signal",
        state: signal.status,
        symbol: signal.metadata.symbol && typeof signal.metadata.symbol === "string"
          ? signal.metadata.symbol
          : signal.signalInputId,
        timeframe:
          signal.metadata.timeframe && typeof signal.metadata.timeframe === "string"
            ? signal.metadata.timeframe
            : null,
        direction:
          signal.metadata.direction && typeof signal.metadata.direction === "string"
            ? signal.metadata.direction
            : null,
        sourceProvider: null,
        confidenceScore: signal.confidenceScore,
        setupQualityScore: signal.setupQualityScore,
        riskLabel: signal.riskLabel,
        publishRecommendation: signal.publishRecommendation,
        approvedBy: signal.approvedBy,
        publishedAt: signal.publishedAt,
        updatedAt: signal.updatedAt,
        summary: signal.setupRationale ?? signal.marketContext ?? "Signal draft",
        telegramPreview: signal.editedTelegramDraft ?? signal.telegramDraft
      }))
    };
  }

  private async filterSignalsByStatus(status: SignalSnapshot["status"]): Promise<SignalSnapshot[]> {
    const signals = await this.signalRepository.listAll();
    return signals
      .filter((signal) => signal.status === status)
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }
}
