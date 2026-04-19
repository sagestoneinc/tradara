import type { MarketInsightSnapshot, SignalSnapshot } from "@tradara/shared-types";

import type { MarketInsightRepository, SignalRepository } from "../../repositories/types";

export class SignalAdminReadService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly marketInsightRepository: MarketInsightRepository
  ) {}

  async getReviewQueue(): Promise<SignalSnapshot[]> {
    const signals = await this.signalRepository.listAll();
    return signals.filter((signal) => signal.status === "pending_review");
  }

  async getPublishedSignals(): Promise<SignalSnapshot[]> {
    const signals = await this.signalRepository.listAll();
    return signals.filter((signal) => signal.status === "published");
  }

  async getRejectedSignals(): Promise<SignalSnapshot[]> {
    const signals = await this.signalRepository.listAll();
    return signals.filter((signal) => signal.status === "rejected");
  }

  async getMarketInsights(): Promise<MarketInsightSnapshot[]> {
    return this.marketInsightRepository.listAll();
  }
}
