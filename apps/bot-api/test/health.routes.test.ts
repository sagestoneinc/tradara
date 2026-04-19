import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

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

describe("health routes", () => {
  it("returns ok at the root path", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const response = await app.inject({
      method: "GET",
      url: "/"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json().data.service).toBe("bot-api");
  });
});