import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import { parseInput } from "../../../lib/zod";
import {
  telegramWebhookHeadersSchema,
  telegramWebhookPayloadSchema
} from "./telegram-webhook.schemas";
import type { TelegramWebhookService } from "./telegram-webhook.service";

export class TelegramWebhookController {
  constructor(private readonly telegramWebhookService: TelegramWebhookService) {}

  handle = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const headers = parseInput(telegramWebhookHeadersSchema, request.headers);
    const payload = parseInput(telegramWebhookPayloadSchema, request.body);
    const result = await this.telegramWebhookService.handleIncoming(
      headers["x-telegram-bot-api-secret-token"],
      payload
    );

    reply.status(result.duplicate ? 200 : 202).send(ok(result));
  };
}
