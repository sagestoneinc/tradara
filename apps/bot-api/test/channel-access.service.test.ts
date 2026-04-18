import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import {
  InMemoryAuditLogRepository,
  InMemoryChannelAccessRepository,
  InMemorySubscriptionRepository,
  InMemoryTelegramInviteRepository
} from "../src/repositories/in-memory-repositories";
import { ChannelAccessService } from "../src/modules/channel-access/channel-access.service";
import { EntitlementService } from "../src/modules/channel-access/entitlement.service";
import {
  TelegramProviderError,
  type TelegramAccessAdapter
} from "../src/modules/channel-access/telegram-access.adapter";

const env = loadBotApiEnv({
  NODE_ENV: "test",
  BOT_API_PORT: "3001",
  BOT_API_BASE_URL: "http://localhost:3001",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
  TELEGRAM_BOT_TOKEN: "token",
  TELEGRAM_WEBHOOK_SECRET: "telegram-secret",
  TELEGRAM_PREMIUM_CHANNEL_ID: "-1000001",
  TELEGRAM_BOT_USERNAME: "tradara_bot",
  PAYMONGO_WEBHOOK_SECRET: "paymongo-secret",
  ACCESS_GRACE_PERIOD_HOURS: "72"
});

describe("ChannelAccessService delivery retries", () => {
  it("keeps retryable revoke failures pending and records execution details", async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository([
      {
        id: "sub_expired_001",
        userId: "user_expired",
        planId: "tradara-pro-monthly",
        status: "expired",
        currentPeriodEndsAt: "2026-04-17T12:00:00.000Z",
        gracePeriodEndsAt: null
      }
    ]);
    const channelAccessRepository = new InMemoryChannelAccessRepository([
      {
        id: "access_expired_001",
        userId: "user_expired",
        subscriptionId: "sub_expired_001",
        channelId: "-1000001",
        telegramUserId: "10003",
        status: "pending_revoke",
        desiredState: "revoke",
        inviteId: null,
        lastSyncedAt: null,
        lastError: null,
        updatedAt: "2026-04-18T12:00:00.000Z"
      }
    ]);
    const inviteRepository = new InMemoryTelegramInviteRepository();
    const auditLogRepository = new InMemoryAuditLogRepository();
    const entitlementService = new EntitlementService(() => new Date("2026-04-18T12:00:00.000Z"));
    let revokeAttempts = 0;

    const adapter: TelegramAccessAdapter = {
      async createInviteLink() {
        throw new Error("not used");
      },
      async revokeAccess() {
        revokeAttempts += 1;
        throw new TelegramProviderError(
          "Telegram temporarily unavailable.",
          "telegram_provider_unavailable",
          "retryable",
          "banChatMember",
          503
        );
      }
    };

    const service = new ChannelAccessService(
      env,
      subscriptionRepository,
      channelAccessRepository,
      inviteRepository,
      auditLogRepository,
      entitlementService,
      adapter,
      () => new Date("2026-04-18T12:00:00.000Z"),
      async () => {}
    );

    const record = await service.executePendingRevoke("user_expired", "reconciliation-job");
    const logs = await service.listAuditLogs(10);

    expect(revokeAttempts).toBe(3);
    expect(record).toMatchObject({
      status: "pending_revoke",
      executionStatus: "failed_retryable",
      executionAttempts: 3,
      lastErrorCode: "telegram_provider_unavailable",
      lastFailureKind: "retryable"
    });
    expect(logs.filter((log) => log.action === "channel_access.revoke_failed")).toHaveLength(3);
  });

  it("marks non-retryable revoke failures as operator-visible errors", async () => {
    const subscriptionRepository = new InMemorySubscriptionRepository([
      {
        id: "sub_expired_001",
        userId: "user_expired",
        planId: "tradara-pro-monthly",
        status: "expired",
        currentPeriodEndsAt: "2026-04-17T12:00:00.000Z",
        gracePeriodEndsAt: null
      }
    ]);
    const channelAccessRepository = new InMemoryChannelAccessRepository([
      {
        id: "access_expired_001",
        userId: "user_expired",
        subscriptionId: "sub_expired_001",
        channelId: "-1000001",
        telegramUserId: "10003",
        status: "pending_revoke",
        desiredState: "revoke",
        inviteId: null,
        lastSyncedAt: null,
        lastError: null,
        updatedAt: "2026-04-18T12:00:00.000Z"
      }
    ]);
    const service = new ChannelAccessService(
      env,
      subscriptionRepository,
      channelAccessRepository,
      new InMemoryTelegramInviteRepository(),
      new InMemoryAuditLogRepository(),
      new EntitlementService(() => new Date("2026-04-18T12:00:00.000Z")),
      {
        async createInviteLink() {
          throw new Error("not used");
        },
        async revokeAccess() {
          throw new TelegramProviderError(
            "Bot is missing channel admin rights.",
            "telegram_permission_denied",
            "non_retryable",
            "banChatMember",
            403
          );
        }
      },
      () => new Date("2026-04-18T12:00:00.000Z"),
      async () => {}
    );

    const record = await service.executePendingRevoke("user_expired", "reconciliation-job");

    expect(record).toMatchObject({
      status: "error",
      executionStatus: "failed_non_retryable",
      executionAttempts: 1,
      lastErrorCode: "telegram_permission_denied",
      lastFailureKind: "non_retryable"
    });
  });
});
