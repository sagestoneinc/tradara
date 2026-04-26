import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import { parseInput } from "../../lib/zod";
import { journalInputSchema, onboardingInputSchema, practiceTradeInputSchema } from "./platform.schemas";
import type { PlatformService } from "./platform.service";

export class PlatformController {
  constructor(private readonly platformService: PlatformService) {}

  getOnboarding = async (request: FastifyRequest<{ Querystring: { userId: string } }>, reply: FastifyReply): Promise<void> => {
    const state = this.platformService.getOnboarding(request.query.userId);
    reply.send(ok({ onboarding: state }));
  };

  upsertOnboarding = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const input = parseInput(onboardingInputSchema, request.body);
    reply.send(ok({ onboarding: this.platformService.upsertOnboarding(input) }));
  };

  listLearningPaths = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok({ paths: this.platformService.listLearningPaths() }));
  };

  getMarketPulse = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok({ pulse: this.platformService.getMarketPulse() }));
  };

  listTradeIdeas = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok({ tradeIdeas: this.platformService.listTradeIdeas() }));
  };

  createPracticeTrade = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const input = parseInput(practiceTradeInputSchema, request.body);
    reply.status(201).send(ok({ trade: this.platformService.createPracticeTrade(input) }));
  };

  createJournalEntry = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const input = parseInput(journalInputSchema, request.body);
    reply.status(201).send(ok({ entry: this.platformService.createJournalEntry(input) }));
  };
}
