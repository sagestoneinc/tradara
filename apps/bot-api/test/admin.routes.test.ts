import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";
import {
  adminAuditLogListDataSchema,
  adminChannelAccessDataSchema,
  adminDiagnosticsDataSchema,
  adminOverviewDataSchema,
  adminSubscriptionsDataSchema,
  adminUsersDataSchema,
  adminWebhookEventsDataSchema
} from "@tradara/shared-types";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";

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

describe("admin routes", () => {
  it("returns typed overview, users, subscriptions, channel access, webhook events, diagnostics, and audit logs", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const webhookResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-secret"
      },
      payload: {
        update_id: 2002,
        chat_member: {
          chat: { id: "-1000001", type: "supergroup" },
          old_chat_member: { status: "left", user: { id: "10003" } },
          new_chat_member: { status: "member", user: { id: "10003" } }
        }
      }
    });

    expect(webhookResponse.statusCode).toBe(202);

    const overviewResponse = await app.inject({ method: "GET", url: "/v1/admin/overview" });
    const usersResponse = await app.inject({ method: "GET", url: "/v1/admin/users" });
    const subscriptionsResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/subscriptions"
    });
    const channelAccessResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/channel-access"
    });
    const webhookEventsResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/webhook-events"
    });
    const diagnosticsResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/diagnostics"
    });
    const auditLogsResponse = await app.inject({ method: "GET", url: "/v1/admin/audit-logs" });

    expect(adminOverviewDataSchema.parse(overviewResponse.json().data).metrics.grantedAccess).toBeGreaterThan(0);
    expect(adminUsersDataSchema.parse(usersResponse.json().data).rows.length).toBeGreaterThan(0);
    expect(adminSubscriptionsDataSchema.parse(subscriptionsResponse.json().data).plans.length).toBeGreaterThan(0);
    expect(
      adminChannelAccessDataSchema.parse(channelAccessResponse.json().data).rows.some(
        (row) => row.userId === "user_expired"
      )
    ).toBe(true);
    expect(adminWebhookEventsDataSchema.parse(webhookEventsResponse.json().data).metrics.totalEvents).toBe(1);
    expect(adminDiagnosticsDataSchema.parse(diagnosticsResponse.json().data).recentWebhookEvents).toHaveLength(1);
    expect(adminAuditLogListDataSchema.parse(auditLogsResponse.json().data).rows.length).toBeGreaterThan(0);
  });
});
