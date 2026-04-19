import type { FastifyInstance } from "fastify";

import type { AdminController } from "./admin.controller";
import type { AuthController } from "../auth/auth.controller";

export async function registerAdminRoutes(
  app: FastifyInstance,
  controller: AdminController,
  authController: AuthController
): Promise<void> {
  const secured = { preHandler: authController.verifyAdminAccess };

  app.get("/v1/admin/overview", secured, controller.getOverview);
  app.get("/v1/admin/users", secured, controller.getUsers);
  app.get("/v1/admin/subscriptions", secured, controller.getSubscriptions);
  app.get("/v1/admin/channel-access", secured, controller.getChannelAccess);
  app.get("/v1/admin/webhook-events", secured, controller.getWebhookEvents);
  app.get("/v1/admin/diagnostics", secured, controller.getDiagnostics);
  app.get("/v1/admin/audit-logs", secured, controller.getAuditLogs);
  app.get("/v1/admin/signals/review-queue", secured, controller.getSignalReviewQueue);
  app.get("/v1/admin/signals/approved", secured, controller.getApprovedSignals);
  app.get("/v1/admin/signals/published", secured, controller.getPublishedSignals);
  app.get("/v1/admin/signals/rejected", secured, controller.getRejectedSignals);
  app.get("/v1/admin/signals/watchlist", secured, controller.getSignalWatchlist);
  app.get("/v1/admin/signals/market-insights", secured, controller.getMarketInsights);
}
