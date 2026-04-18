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
}
