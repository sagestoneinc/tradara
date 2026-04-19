import { describe, expect, it } from "vitest";
import {
  adminAuditLogListDataSchema,
  adminChannelAccessDataSchema,
  adminDiagnosticsDataSchema,
  adminMarketInsightsListDataSchema,
  adminOverviewDataSchema,
  adminSignalListDataSchema,
  adminSubscriptionsDataSchema,
  adminUsersDataSchema,
  adminWebhookEventsDataSchema
} from "@tradara/shared-types";

import {
  InMemoryAuditLogRepository,
  InMemoryMarketInsightRepository,
  InMemorySignalRepository,
  InMemoryWebhookEventRepository
} from "../src/repositories/in-memory-repositories";
import { AdminService } from "../src/modules/admin/admin.service";
import { SignalAdminReadService } from "../src/modules/signals/signal-admin-read.service";

const now = new Date("2026-04-19T12:00:00.000Z");

const channelAccessService = {
  async listOverview() {
    return [
      {
        userId: "user_active",
        subscription: {
          id: "sub_active_001",
          userId: "user_active",
          planId: "tradara-pro-monthly" as const,
          status: "active" as const,
          currentPeriodEndsAt: "2026-05-01T12:00:00.000Z",
          gracePeriodEndsAt: null
        },
        entitlement: {
          userId: "user_active",
          status: "active" as const,
          premiumChannelEligible: true,
          reason: "Active billing grants access.",
          gracePeriodEndsAt: null
        },
        accessRecord: {
          id: "access_1",
          userId: "user_active",
          subscriptionId: "sub_active_001",
          channelId: "-1000001",
          telegramUserId: "10001",
          status: "granted" as const,
          desiredState: "grant" as const,
          inviteId: null,
          lastSyncedAt: "2026-04-19T11:00:00.000Z",
          lastError: null,
          updatedAt: "2026-04-19T11:00:00.000Z"
        }
      },
      {
        userId: "user_grace",
        subscription: {
          id: "sub_grace_001",
          userId: "user_grace",
          planId: "tradara-pro-quarterly" as const,
          status: "grace_period" as const,
          currentPeriodEndsAt: "2026-04-18T12:00:00.000Z",
          gracePeriodEndsAt: "2026-04-21T12:00:00.000Z"
        },
        entitlement: {
          userId: "user_grace",
          status: "grace_period" as const,
          premiumChannelEligible: true,
          reason: "Grace period still grants access.",
          gracePeriodEndsAt: "2026-04-21T12:00:00.000Z"
        },
        accessRecord: {
          id: "access_2",
          userId: "user_grace",
          subscriptionId: "sub_grace_001",
          channelId: "-1000001",
          telegramUserId: "10002",
          status: "pending_grant" as const,
          desiredState: "grant" as const,
          inviteId: null,
          lastSyncedAt: null,
          lastError: "Rate limited",
          lastErrorCode: "429",
          lastFailureKind: "retryable" as const,
          executionStatus: "retrying" as const,
          lastCorrelationId: "trace_123",
          updatedAt: "2026-04-19T10:45:00.000Z"
        }
      }
    ];
  },
  async listAuditLogs(limit = 25) {
    return [
      {
        id: "audit_1",
        actorType: "job" as const,
        actorId: "channel-access-reconciliation",
        action: "channel_access.grant_execution_attempted",
        entityType: "channel_access",
        entityId: "access_2",
        metadata: {
          userId: "user_grace",
          correlationId: "trace_123",
          attempt: 1
        },
        createdAt: "2026-04-19T10:45:00.000Z"
      }
    ].slice(0, limit);
  }
};

const webhookEventRepository = new InMemoryWebhookEventRepository([
  {
    id: "webhook_1",
    provider: "telegram",
    providerEventId: "evt_1",
    payloadHash: "hash_1",
    signatureValid: true,
    processedAt: "2026-04-19T11:00:00.000Z",
    receivedAt: "2026-04-19T10:59:00.000Z"
  }
]);

const signalRepository = new InMemorySignalRepository([
  {
    id: "signal_review",
    signalInputId: "input_review",
    status: "pending_review",
    sourceType: "manual",
    confidenceScore: 84,
    setupQualityScore: 81,
    riskLabel: "medium",
    publishRecommendation: "review",
    invalidationSummary: null,
    setupRationale: "Strong structure with manageable conflict.",
    marketContext: "Selective but still tradable.",
    warnings: ["Wait for confirmation."],
    confidenceBreakdown: {
      trendAlignment: 80,
      structureQuality: 82,
      volatilityQuality: 68,
      liquidityQuality: 76,
      riskRewardQuality: 88,
      conflictPenalty: 18,
      weightedPositiveScore: 80,
      finalScore: 74
    },
    telegramDraft: "Draft review signal",
    expertReviewNotes: null,
    editedTelegramDraft: null,
    publishedTelegramText: null,
    publishedTelegramChatId: null,
    publishedTelegramMessageId: null,
    approvedBy: null,
    approvedAt: null,
    rejectedBy: null,
    rejectedAt: null,
    publishedBy: null,
    publishedAt: null,
    canceledAt: null,
    metadata: {},
    createdAt: "2026-04-18T12:00:00.000Z",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    id: "signal_published",
    signalInputId: "input_published",
    status: "published",
    sourceType: "manual",
    confidenceScore: 91,
    setupQualityScore: 89,
    riskLabel: "low",
    publishRecommendation: "review",
    invalidationSummary: null,
    setupRationale: "Published.",
    marketContext: "Favorable.",
    warnings: [],
    confidenceBreakdown: {
      trendAlignment: 88,
      structureQuality: 88,
      volatilityQuality: 80,
      liquidityQuality: 84,
      riskRewardQuality: 92,
      conflictPenalty: 8,
      weightedPositiveScore: 87,
      finalScore: 84
    },
    telegramDraft: "Draft published signal",
    expertReviewNotes: null,
    editedTelegramDraft: "Edited published signal",
    publishedTelegramText: "Edited published signal",
    publishedTelegramChatId: "-100signal",
    publishedTelegramMessageId: "55",
    approvedBy: "expert_1",
    approvedAt: "2026-04-18T13:00:00.000Z",
    rejectedBy: null,
    rejectedAt: null,
    publishedBy: "publisher_1",
    publishedAt: "2026-04-18T14:00:00.000Z",
    canceledAt: null,
    metadata: {},
    createdAt: "2026-04-18T12:30:00.000Z",
    updatedAt: "2026-04-18T14:00:00.000Z"
  },
  {
    id: "signal_rejected",
    signalInputId: "input_rejected",
    status: "rejected",
    sourceType: "manual",
    confidenceScore: 39,
    setupQualityScore: 48,
    riskLabel: "high",
    publishRecommendation: "reject",
    invalidationSummary: null,
    setupRationale: "Too conflicted.",
    marketContext: "Poor conditions.",
    warnings: ["Avoid forcing a trade."],
    confidenceBreakdown: {
      trendAlignment: 42,
      structureQuality: 48,
      volatilityQuality: 34,
      liquidityQuality: 58,
      riskRewardQuality: 40,
      conflictPenalty: 70,
      weightedPositiveScore: 44,
      finalScore: 20
    },
    telegramDraft: "Rejected draft",
    expertReviewNotes: "Rejected.",
    editedTelegramDraft: null,
    publishedTelegramText: null,
    publishedTelegramChatId: null,
    publishedTelegramMessageId: null,
    approvedBy: null,
    approvedAt: null,
    rejectedBy: "expert_2",
    rejectedAt: "2026-04-18T15:00:00.000Z",
    publishedBy: null,
    publishedAt: null,
    canceledAt: null,
    metadata: {},
    createdAt: "2026-04-18T12:45:00.000Z",
    updatedAt: "2026-04-18T15:00:00.000Z"
  },
  {
    id: "signal_watchlist",
    signalInputId: "input_watchlist",
    status: "watchlist",
    sourceType: "manual",
    confidenceScore: 61,
    setupQualityScore: 66,
    riskLabel: "medium",
    publishRecommendation: "watchlist",
    invalidationSummary: null,
    setupRationale: "Good idea, poor timing.",
    marketContext: "Patient posture.",
    warnings: ["Needs stronger confirmation."],
    confidenceBreakdown: {
      trendAlignment: 60,
      structureQuality: 68,
      volatilityQuality: 58,
      liquidityQuality: 70,
      riskRewardQuality: 72,
      conflictPenalty: 24,
      weightedPositiveScore: 67,
      finalScore: 58
    },
    telegramDraft: "Watchlist draft",
    expertReviewNotes: null,
    editedTelegramDraft: null,
    publishedTelegramText: null,
    publishedTelegramChatId: null,
    publishedTelegramMessageId: null,
    approvedBy: null,
    approvedAt: null,
    rejectedBy: null,
    rejectedAt: null,
    publishedBy: null,
    publishedAt: null,
    canceledAt: null,
    metadata: {},
    createdAt: "2026-04-18T13:15:00.000Z",
    updatedAt: "2026-04-18T13:15:00.000Z"
  }
]);

const marketInsightRepository = new InMemoryMarketInsightRepository([
  {
    id: "insight_1",
    status: "draft",
    symbol: "TOTAL",
    timeframe: "1D",
    title: "Market audit",
    summary: "Conditions are mixed.",
    body: "Stay selective while BTC consolidates.",
    btcBias: "neutral",
    ethBias: "neutral",
    altcoinBias: "bearish",
    riskEnvironment: "medium",
    executionPosture: "selective",
    warnings: ["Alt momentum is weak."],
    telegramDraft: "Insight draft",
    approvedBy: null,
    approvedAt: null,
    publishedBy: null,
    publishedAt: null,
    rejectedBy: null,
    rejectedAt: null,
    canceledAt: null,
    metadata: {},
    createdAt: "2026-04-18T12:00:00.000Z",
    updatedAt: "2026-04-18T12:00:00.000Z"
  }
]);

describe("admin data services", () => {
  it("returns typed overview, users, subscriptions, channel access, webhook events, diagnostics, and audit logs", async () => {
    const adminService = new AdminService(
      channelAccessService as never,
      webhookEventRepository,
      new SignalAdminReadService(signalRepository, marketInsightRepository),
      () => now
    );

    expect(adminOverviewDataSchema.parse(await adminService.getOverviewData()).metrics.grantedAccess).toBeGreaterThan(0);
    expect(adminUsersDataSchema.parse(await adminService.getUsersData()).rows.length).toBeGreaterThan(0);
    expect(adminSubscriptionsDataSchema.parse(await adminService.getSubscriptionsData()).plans.length).toBeGreaterThan(0);
    expect(
      adminChannelAccessDataSchema.parse(await adminService.getChannelAccessData()).rows.some(
        (row) => row.userId === "user_grace"
      )
    ).toBe(true);
    expect(adminWebhookEventsDataSchema.parse(await adminService.getWebhookEventsData()).metrics.totalEvents).toBe(1);
    expect(adminDiagnosticsDataSchema.parse(await adminService.getDiagnosticsData()).recentWebhookEvents).toHaveLength(1);
    expect(adminAuditLogListDataSchema.parse(await adminService.getAuditLogData()).rows.length).toBeGreaterThan(0);
  });

  it("returns signal admin slices for review queue, published, rejected, watchlist, and market insights", async () => {
    const adminService = new AdminService(
      channelAccessService as never,
      webhookEventRepository,
      new SignalAdminReadService(signalRepository, marketInsightRepository),
      () => now
    );

    expect(adminSignalListDataSchema.parse(await adminService.getSignalReviewQueueData()).rows).toHaveLength(1);
    expect(adminSignalListDataSchema.parse(await adminService.getPublishedSignalsData()).rows).toHaveLength(1);
    expect(adminSignalListDataSchema.parse(await adminService.getRejectedSignalsData()).rows).toHaveLength(1);
    expect(adminSignalListDataSchema.parse(await adminService.getSignalWatchlistData()).rows).toHaveLength(1);
    expect(adminMarketInsightsListDataSchema.parse(await adminService.getMarketInsightsListData()).rows).toHaveLength(1);
  });
});
