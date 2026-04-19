import type { FastifyInstance } from "fastify";

import type { AuthController } from "./auth.controller";

export async function registerAuthRoutes(
  app: FastifyInstance,
  controller: AuthController
): Promise<void> {
  app.post("/v1/auth/clerk/webhooks", controller.handleClerkWebhook);
  app.get("/v1/account/me", controller.getAccountProfile);
  app.get("/v1/account/access", controller.getAccountAccess);
  app.post("/v1/telegram/link-sessions", controller.createTelegramLinkSession);
}
