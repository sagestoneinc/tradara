import type { FastifyReply, FastifyRequest } from "fastify";
import type { BotApiEnv } from "@tradara/shared-config";
import { ok } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import { parseInput } from "../../lib/zod";
import type { SignalAdminReadService } from "./signal-admin-read.service";
import type { MarketInsightsService } from "./market-insights.service";
import type { SignalIngestionService } from "./signal-ingestion.service";
import type { SignalPublishingService } from "./signal-publishing.service";
import type { SignalReviewService } from "./signal-review.service";
import type { SignalScoringService } from "./signal-scoring.service";
import {
  createMarketInsightSchema,
  publishSignalSchema,
  reviewSignalSchema,
  tradingViewWebhookHeadersSchema,
  tradingViewSignalSchema
} from "./signals.schemas";

export class SignalsController {
  constructor(
    private readonly env: BotApiEnv,
    private readonly signalIngestionService: SignalIngestionService,
    private readonly signalScoringService: SignalScoringService,
    private readonly signalReviewService: SignalReviewService,
    private readonly signalPublishingService: SignalPublishingService,
    private readonly marketInsightsService: MarketInsightsService,
    private readonly signalAdminReadService: SignalAdminReadService
  ) {}

  ingestTradingView = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    this.verifyTradingViewSecret(parseInput(tradingViewWebhookHeadersSchema, request.headers));
    const body = parseInput(tradingViewSignalSchema, request.body);
    const result = await this.signalIngestionService.createDraftFromTradingView(body);
    reply.status(202).send(ok(result));
  };

  enrichSignal = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const signalId = (request.params as { signalId: string }).signalId;
    reply.send(ok(await this.signalScoringService.enrichDraft(signalId)));
  };

  reviewSignal = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const signalId = (request.params as { signalId: string }).signalId;
    const body = parseInput(reviewSignalSchema, request.body);
    reply.send(ok(await this.signalReviewService.submitReview(signalId, body)));
  };

  publishSignal = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const signalId = (request.params as { signalId: string }).signalId;
    const body = parseInput(publishSignalSchema, request.body);
    reply.send(ok(await this.signalPublishingService.publish(signalId, body)));
  };

  createMarketInsight = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = parseInput(createMarketInsightSchema, request.body);
    reply.status(202).send(ok(await this.marketInsightsService.createDraft(body)));
  };

  getSignalsAdminData = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.signalAdminReadService.getAdminSignalsData()));
  };

  private verifyTradingViewSecret(headers: {
    authorization?: string;
    "x-tradingview-secret"?: string;
    "x-tradara-webhook-secret"?: string;
  }): void {
    if (!this.env.TRADINGVIEW_WEBHOOK_SECRET) {
      throw new DomainError(
        "TradingView webhook secret is not configured.",
        503,
        "tradingview_webhook_not_configured"
      );
    }

    const bearerSecret = headers.authorization?.startsWith("Bearer ")
      ? headers.authorization.slice("Bearer ".length).trim()
      : null;
    const providedSecret =
      headers["x-tradara-webhook-secret"] ?? headers["x-tradingview-secret"] ?? bearerSecret;

    if (providedSecret !== this.env.TRADINGVIEW_WEBHOOK_SECRET) {
      throw new DomainError(
        "TradingView webhook verification failed.",
        401,
        "tradingview_webhook_verification_failed"
      );
    }
  }
}
