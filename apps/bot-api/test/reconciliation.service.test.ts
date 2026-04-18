import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import { createContainer } from "../src/container";
import type { RepositorySeed } from "../src/repositories/in-memory-repositories";
import type { TelegramAccessAdapter } from "../src/modules/channel-access/telegram-access.adapter";

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

describe("channel access reconciliation", () => {
  it("stages revoke when billing no longer grants access", async () => {
    const adapterCalls: string[] = [];
    const app = createContainer(env, {
      persistence: "memory",
      telegramAccessAdapter: {
        async createInviteLink() {
          adapterCalls.push("grant");
          return {
            status: "issued",
            inviteUrl: "https://t.me/joinchat/example",
            note: "issued"
          };
        },
        async revokeAccess() {
          adapterCalls.push("revoke");
          return {
            status: "revoked",
            note: "revoked"
          };
        }
      } satisfies TelegramAccessAdapter
    });
    const actions = await app.jobs.channelAccessReconciliation.runOnce("Nightly access reconciliation");

    const revokeAction = actions.find((item) => item.userId === "user_expired");
    expect(revokeAction?.type).toBe("revoke");
    expect(adapterCalls).toContain("revoke");
  });

  it("stages grant when grace-period access should stay available", async () => {
    const adapterCalls: string[] = [];
    const seed: RepositorySeed = {
      subscriptions: [
        {
          id: "sub_grace_001",
          userId: "user_grace",
          planId: "tradara-pro-quarterly",
          status: "grace_period",
          currentPeriodEndsAt: "2026-04-18T00:00:00.000Z",
          gracePeriodEndsAt: "2026-04-21T12:00:00.000Z"
        }
      ],
      channelAccess: [
        {
          id: "access_grace_001",
          userId: "user_grace",
          subscriptionId: "sub_grace_001",
          channelId: "-1000001",
          telegramUserId: "10002",
          status: "pending_grant",
          desiredState: "grant",
          inviteId: null,
          lastSyncedAt: null,
          lastError: null,
          updatedAt: "2026-04-18T12:00:00.000Z"
        }
      ]
    };
    const app = createContainer(env, {
      persistence: "memory",
      seed,
      telegramAccessAdapter: {
        async createInviteLink() {
          adapterCalls.push("grant");
          return {
            status: "issued",
            inviteUrl: "https://t.me/joinchat/example",
            note: "issued"
          };
        },
        async revokeAccess() {
          adapterCalls.push("revoke");
          return {
            status: "revoked",
            note: "revoked"
          };
        }
      } satisfies TelegramAccessAdapter
    });
    const actions = await app.jobs.channelAccessReconciliation.runOnce("Nightly access reconciliation");

    const grantAction = actions.find((item) => item.userId === "user_grace");
    expect(grantAction?.type).toBe("grant");
    expect(adapterCalls).toContain("grant");
  });
});
