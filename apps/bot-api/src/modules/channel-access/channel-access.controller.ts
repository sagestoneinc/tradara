import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import { parseInput } from "../../lib/zod";
import type { ChannelAccessReconciliationJob } from "../../jobs/channel-access-reconciliation.job";
import {
  inviteLinkBodySchema,
  reconcileRequestSchema,
  userIdParamsSchema
} from "./channel-access.schemas";
import type { ChannelAccessService } from "./channel-access.service";

export class ChannelAccessController {
  constructor(
    private readonly channelAccessService: ChannelAccessService,
    private readonly reconciliationJob: ChannelAccessReconciliationJob
  ) {}

  listOverview = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const overview = await this.channelAccessService.listOverview();
    reply.send(ok(overview));
  };

  getByUserId = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const params = parseInput(userIdParamsSchema, request.params);
    const overview = await this.channelAccessService.getOverviewByUserId(params.userId);
    reply.send(ok(overview));
  };

  issueInviteLink = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = parseInput(inviteLinkBodySchema, request.body);
    const result = await this.channelAccessService.issueInviteLink(body);
    reply.status(202).send(ok(result));
  };

  reconcile = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = parseInput(reconcileRequestSchema, request.body ?? {});
    const actions = await this.reconciliationJob.runOnce(body.reason);
    reply.status(202).send(ok(actions));
  };

  listAuditLogs = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const auditLogs = await this.channelAccessService.listAuditLogs();
    reply.send(ok(auditLogs));
  };
}
