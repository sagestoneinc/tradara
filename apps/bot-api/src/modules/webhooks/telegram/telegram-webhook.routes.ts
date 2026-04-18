import type { FastifyInstance } from "fastify";

import { TelegramWebhookController } from "./telegram-webhook.controller";

export async function registerTelegramWebhookRoutes(
  app: FastifyInstance,
  controller: TelegramWebhookController
): Promise<void> {
  app.post("/v1/webhooks/telegram", controller.handle);
}

