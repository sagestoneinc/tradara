import type { CreateMarketInsightRequest, MarketInsightSnapshot } from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { AiMarketAuditorService } from "../ai/ai-market-auditor.service";
import type { MarketInsightRepository } from "../../repositories/types";

export class MarketInsightsService {
  constructor(
    private readonly marketInsightRepository: MarketInsightRepository,
    private readonly aiMarketAuditor: AiMarketAuditorService,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async createDraft(input: CreateMarketInsightRequest): Promise<MarketInsightSnapshot> {
    const analysis = await this.aiMarketAuditor.analyze(input);
    const now = isoNow(this.clock());
    const insight: MarketInsightSnapshot = {
      id: createId("market_insight"),
      status: "draft",
      symbol: input.symbol,
      timeframe: input.timeframe ?? null,
      title: input.title,
      summary: analysis.summary,
      body: input.body,
      btcBias: analysis.marketBias.btc,
      ethBias: analysis.marketBias.eth,
      altcoinBias: analysis.marketBias.altcoins,
      riskEnvironment: analysis.riskEnvironment,
      executionPosture: analysis.posture,
      warnings: analysis.warnings,
      telegramDraft: analysis.telegramDraft,
      approvedBy: null,
      approvedAt: null,
      publishedBy: null,
      publishedAt: null,
      rejectedBy: null,
      rejectedAt: null,
      canceledAt: null,
      metadata: {
        ...(input.metadata ?? {}),
        marketAudit: analysis
      },
      createdAt: now,
      updatedAt: now
    };

    await this.marketInsightRepository.save(insight);
    return insight;
  }
}
