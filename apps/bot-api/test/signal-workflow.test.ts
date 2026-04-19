import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import {
  InMemoryMarketInsightRepository,
  InMemorySignalInputRepository,
  InMemorySignalRepository,
  InMemorySignalReviewRepository
} from "../src/repositories/in-memory-repositories";
import { AiMarketAuditorService } from "../src/modules/ai/ai-market-auditor.service";
import { AiSignalAnalystService } from "../src/modules/ai/ai-signal-analyst.service";
import { MarketInsightsService } from "../src/modules/signals/market-insights.service";
import { SignalAdminReadService } from "../src/modules/signals/signal-admin-read.service";
import { SignalIngestionService } from "../src/modules/signals/signal-ingestion.service";
import { SignalPublishingService } from "../src/modules/signals/signal-publishing.service";
import { SignalReviewService } from "../src/modules/signals/signal-review.service";
import { SignalScoringService } from "../src/modules/signals/signal-scoring.service";
import { SignalsController } from "../src/modules/signals/signals.controller";

describe("signal workflow foundation", () => {
  it("creates a draft signal, enriches it, and moves it to pending review", async () => {
    const signalInputRepository = new InMemorySignalInputRepository();
    const signalRepository = new InMemorySignalRepository();
    const ingestionService = new SignalIngestionService(signalInputRepository, signalRepository);
    const scoringService = new SignalScoringService(
      signalRepository,
      signalInputRepository,
      new AiSignalAnalystService()
    );

    const { signal } = await ingestionService.createDraft({
      sourceType: "manual",
      symbol: "BTCUSDT",
      timeframe: "1H",
      direction: "long",
      trendAlignment: 82,
      structureQuality: 76,
      volatilityQuality: 64,
      liquidityQuality: 70,
      riskRewardQuality: 88,
      conflictPenalty: 18
    });

    expect(signal.status).toBe("draft");

    const enriched = await scoringService.enrichDraft(signal.id);

    expect(enriched.signal.status).toBe("pending_review");
    expect(enriched.signal.confidenceScore).toBeGreaterThan(0);
    expect(enriched.signal.telegramDraft).toContain("BTCUSDT");
    expect(enriched.signal.metadata.aiEnrichment).toBeDefined();
  });

  it("stores review history and transitions the signal cleanly", async () => {
    const signalInputRepository = new InMemorySignalInputRepository();
    const signalRepository = new InMemorySignalRepository();
    const signalReviewRepository = new InMemorySignalReviewRepository();
    const ingestionService = new SignalIngestionService(signalInputRepository, signalRepository);
    const scoringService = new SignalScoringService(
      signalRepository,
      signalInputRepository,
      new AiSignalAnalystService()
    );
    const reviewService = new SignalReviewService(signalRepository, signalReviewRepository);

    const { signal } = await ingestionService.createDraft({
      sourceType: "manual",
      symbol: "ETHUSDT",
      timeframe: "4H",
      direction: "short",
      trendAlignment: 84,
      structureQuality: 82,
      volatilityQuality: 72,
      liquidityQuality: 80,
      riskRewardQuality: 86,
      conflictPenalty: 10
    });
    const enriched = await scoringService.enrichDraft(signal.id);

    const reviewed = await reviewService.submitReview(enriched.signal.id, {
      reviewerId: "expert_001",
      action: "edit",
      notes: "Tighten wording before publication.",
      editedTelegramDraft: "Edited draft for publication review."
    });

    expect(reviewed.signal.status).toBe("edited");
    expect(reviewed.review.resultingStatus).toBe("edited");
    expect((await signalReviewRepository.listBySignalId(enriched.signal.id))).toHaveLength(1);
  });

  it("publishes only approved or edited signals and stores publish metadata", async () => {
    const signalInputRepository = new InMemorySignalInputRepository();
    const signalRepository = new InMemorySignalRepository();
    const signalReviewRepository = new InMemorySignalReviewRepository();
    const ingestionService = new SignalIngestionService(signalInputRepository, signalRepository);
    const scoringService = new SignalScoringService(
      signalRepository,
      signalInputRepository,
      new AiSignalAnalystService()
    );
    const reviewService = new SignalReviewService(signalRepository, signalReviewRepository);
    const publishingService = new SignalPublishingService(signalRepository);

    const { signal } = await ingestionService.createDraft({
      sourceType: "manual",
      symbol: "SOLUSDT",
      timeframe: "15M",
      direction: "long",
      trendAlignment: 86,
      structureQuality: 84,
      volatilityQuality: 76,
      liquidityQuality: 83,
      riskRewardQuality: 90,
      conflictPenalty: 9
    });
    const enriched = await scoringService.enrichDraft(signal.id);
    await reviewService.submitReview(enriched.signal.id, {
      reviewerId: "expert_002",
      action: "approve",
      notes: "Approved for publication."
    });

    const published = await publishingService.publish(enriched.signal.id, {
      publisherId: "publisher_001"
    });

    expect(published.signal.status).toBe("published");
    expect(published.publishMetadata.chatId).toBe("tradara-signal-preview");
    expect(published.signal.metadata.publishMetadata).toBeDefined();
  });

  it("creates market insight drafts and exposes admin review slices", async () => {
    const signalInputRepository = new InMemorySignalInputRepository();
    const signalRepository = new InMemorySignalRepository();
    const signalReviewRepository = new InMemorySignalReviewRepository();
    const marketInsightRepository = new InMemoryMarketInsightRepository();
    const ingestionService = new SignalIngestionService(signalInputRepository, signalRepository);
    const scoringService = new SignalScoringService(
      signalRepository,
      signalInputRepository,
      new AiSignalAnalystService()
    );
    const reviewService = new SignalReviewService(signalRepository, signalReviewRepository);
    const marketInsightsService = new MarketInsightsService(
      marketInsightRepository,
      new AiMarketAuditorService()
    );
    const adminReadService = new SignalAdminReadService(signalRepository, marketInsightRepository);

    const { signal } = await ingestionService.createDraft({
      sourceType: "manual",
      symbol: "BTCUSDT",
      timeframe: "1D",
      direction: "neutral",
      trendAlignment: 82,
      structureQuality: 79,
      volatilityQuality: 68,
      liquidityQuality: 84,
      riskRewardQuality: 85,
      conflictPenalty: 11
    });
    const enriched = await scoringService.enrichDraft(signal.id);
    await reviewService.submitReview(enriched.signal.id, {
      reviewerId: "expert_003",
      action: "reject",
      notes: "Not clean enough."
    });
    await marketInsightsService.createDraft({
      symbol: "TOTAL",
      timeframe: "1D",
      title: "Market audit",
      summary: "Conditions remain mixed.",
      body: "BTC and ETH are neutral while traders should stay selective."
    });

    expect((await adminReadService.getReviewQueue())).toHaveLength(0);
    expect((await adminReadService.getRejectedSignals())).toHaveLength(1);
    expect((await adminReadService.getMarketInsights())).toHaveLength(1);
  });

  it("dedupes TradingView drafts by alert id and source type", async () => {
    const signalInputRepository = new InMemorySignalInputRepository();
    const signalRepository = new InMemorySignalRepository();
    const ingestionService = new SignalIngestionService(signalInputRepository, signalRepository);

    const first = await ingestionService.createDraftFromTradingView({
      alertId: "tv_alert_001",
      symbol: "BTCUSDT",
      timeframe: "1H",
      direction: "long",
      trigger: "Breakout"
    });
    const second = await ingestionService.createDraftFromTradingView({
      alertId: "tv_alert_001",
      symbol: "BTCUSDT",
      timeframe: "1H",
      direction: "long",
      trigger: "Breakout"
    });

    expect(first.signalInput.id).toBe(second.signalInput.id);
    expect(first.signal.id).toBe(second.signal.id);
    expect((await signalInputRepository.listAll())).toHaveLength(1);
    expect((await signalRepository.listAll())).toHaveLength(1);
  });

  it("rejects TradingView ingestion when the webhook secret is invalid", async () => {
    const env = loadBotApiEnv({
      NODE_ENV: "test",
      BOT_API_PORT: "3001",
      BOT_API_BASE_URL: "http://localhost:3001",
      DATABASE_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
      TELEGRAM_BOT_TOKEN: "token",
      TELEGRAM_WEBHOOK_SECRET: "telegram-secret",
      TELEGRAM_PREMIUM_CHANNEL_ID: "-1000001",
      TELEGRAM_BOT_USERNAME: "tradara_bot",
      TRADINGVIEW_WEBHOOK_SECRET: "tv-secret",
      ACCESS_GRACE_PERIOD_HOURS: "72"
    });

    const controller = new SignalsController(
      env,
      new SignalIngestionService(new InMemorySignalInputRepository(), new InMemorySignalRepository()),
      {} as never,
      {} as never,
      {} as never,
      {} as never,
      {} as never
    );

    await expect(
      controller.ingestTradingView(
        {
          headers: {
            "x-tradara-webhook-secret": "wrong-secret"
          },
          body: {
            alertId: "tv_alert_002",
            symbol: "ETHUSDT"
          }
        } as never,
        {
          status() {
            return this;
          },
          send() {}
        } as never
      )
    ).rejects.toMatchObject({
      code: "tradingview_webhook_verification_failed"
    });
  });
});
