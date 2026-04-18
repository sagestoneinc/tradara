import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

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

describe("channel access reconciliation", () => {
  it("stages revoke when billing no longer grants access", async () => {
    const app = createContainer(env);
    const actions = await app.jobs.channelAccessReconciliation.runOnce("Nightly access reconciliation");

    const revokeAction = actions.find((item) => item.userId === "user_expired");
    expect(revokeAction?.type).toBe("revoke");
  });

  it("stages grant when grace-period access should stay available", async () => {
    const app = createContainer(env);
    const actions = await app.jobs.channelAccessReconciliation.runOnce("Nightly access reconciliation");

    const grantAction = actions.find((item) => item.userId === "user_grace");
    expect(grantAction?.type).toBe("grant");
  });
});

