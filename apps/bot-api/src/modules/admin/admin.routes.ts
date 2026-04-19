import type { FastifyInstance } from "fastify";

import type { AdminController } from "./admin.controller";

export async function registerAdminRoutes(
  app: FastifyInstance,
  controller: AdminController
): Promise<void> {
  app.get("/v1/admin/overview", controller.getOverview);
  app.get("/v1/admin/users", controller.getUsers);
  app.get("/v1/admin/subscriptions", controller.getSubscriptions);
  app.get("/v1/admin/channel-access", controller.getChannelAccess);
  app.get("/v1/admin/webhook-events", controller.getWebhookEvents);
  app.get("/v1/admin/diagnostics", controller.getDiagnostics);
  app.get("/v1/admin/audit-logs", controller.getAuditLogs);
  app.get("/v1/admin/signals/review-queue", controller.getSignalReviewQueue);
  app.get("/v1/admin/signals/approved", controller.getApprovedSignals);
  app.get("/v1/admin/signals/published", controller.getPublishedSignals);
  app.get("/v1/admin/signals/rejected", controller.getRejectedSignals);
  app.get("/v1/admin/signals/watchlist", controller.getSignalWatchlist);
  app.get("/v1/admin/signals/market-insights", controller.getMarketInsights);
}
