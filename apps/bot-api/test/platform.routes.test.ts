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

describe("platform scaffold routes", () => {
  it("supports onboarding upsert and fetch", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const upsert = await app.inject({
      method: "POST",
      url: "/v1/onboarding",
      payload: {
        userId: "user_beginner",
        experienceLevel: "beginner",
        mode: "lite",
        stopLossUnderstanding: false,
        acknowledgesVolatilityRisk: true
      }
    });

    const fetch = await app.inject({
      method: "GET",
      url: "/v1/onboarding",
      query: { userId: "user_beginner" }
    });

    expect(upsert.statusCode).toBe(200);
    expect(fetch.statusCode).toBe(200);
    expect(fetch.json().data.onboarding.experienceLevel).toBe("beginner");
  });

  it("returns learn paths, market pulse, trade ideas, and allows practice/journal create", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const learn = await app.inject({ method: "GET", url: "/v1/learn/paths" });
    const pulse = await app.inject({ method: "GET", url: "/v1/market-pulse" });
    const tradeIdeas = await app.inject({ method: "GET", url: "/v1/trade-ideas" });
    const practice = await app.inject({
      method: "POST",
      url: "/v1/practice/trades",
      payload: {
        userId: "user_beginner",
        asset: "BTC",
        pair: "BTC/USDT",
        direction: "long",
        entryPrice: 65000,
        size: 0.01
      }
    });
    const journal = await app.inject({
      method: "POST",
      url: "/v1/journal/entries",
      payload: {
        userId: "user_beginner",
        title: "First practice setup",
        notes: "I respected invalidation and used small size.",
        emotion: "calm",
        mistakeTags: ["late-entry"]
      }
    });

    expect(learn.statusCode).toBe(200);
    expect(pulse.statusCode).toBe(200);
    expect(tradeIdeas.statusCode).toBe(200);
    expect(practice.statusCode).toBe(201);
    expect(journal.statusCode).toBe(201);
    expect(learn.json().data.paths.length).toBeGreaterThan(0);
  });
});
