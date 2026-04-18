import type { FastifyInstance } from "fastify";

import type { ChannelAccessController } from "./channel-access.controller";

export async function registerChannelAccessRoutes(
  app: FastifyInstance,
  controller: ChannelAccessController
): Promise<void> {
  app.get("/v1/channel-access", controller.listOverview);
  app.get("/v1/channel-access/:userId", controller.getByUserId);
  app.post("/v1/channel-access/invite-links", controller.issueInviteLink);
  app.post("/v1/channel-access/reconcile", controller.reconcile);
  app.get("/v1/audit-logs", controller.listAuditLogs);
}
