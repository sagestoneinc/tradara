import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

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
  tradingViewSignalSchema
} from "./signals.schemas";

export class SignalsController {
  constructor(
    private readonly signalIngestionService: SignalIngestionService,
    private readonly signalScoringService: SignalScoringService,
    private readonly signalReviewService: SignalReviewService,
    private readonly signalPublishingService: SignalPublishingService,
    private readonly marketInsightsService: MarketInsightsService,
    private readonly signalAdminReadService: SignalAdminReadService
  ) {}

  ingestTradingView = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
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
}
