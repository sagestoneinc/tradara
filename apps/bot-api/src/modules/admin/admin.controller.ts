import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import type { AdminService } from "./admin.service";

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  getOverview = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getOverviewData()));
  };

  getUsers = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getUsersData()));
  };

  getSubscriptions = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getSubscriptionsData()));
  };

  getChannelAccess = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getChannelAccessData()));
  };

  getWebhookEvents = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getWebhookEventsData()));
  };

  getDiagnostics = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getDiagnosticsData()));
  };

  getAuditLogs = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getAuditLogData()));
  };

  getSignalReviewQueue = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getSignalReviewQueueData()));
  };

  getPublishedSignals = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getPublishedSignalsData()));
  };

  getApprovedSignals = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getApprovedSignalsData()));
  };

  getRejectedSignals = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getRejectedSignalsData()));
  };

  getSignalWatchlist = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getSignalWatchlistData()));
  };

  getMarketInsights = async (_request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.adminService.getMarketInsightsListData()));
  };
}
