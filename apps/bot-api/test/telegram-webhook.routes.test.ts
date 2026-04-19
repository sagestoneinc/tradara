import { describe, expect, it, vi } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import type { TelegramBotLike } from "../src/bot/types/bot";
import { BOT_MESSAGES, FALLBACK_MESSAGE } from "../src/bot/content/bot-messages";

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

describe("telegram webhook route", () => {
  it("rejects requests with an invalid secret", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "wrong-secret"
      },
      payload: {
        update_id: 1001,
        chat_member: {
          chat: { id: "-1000001", type: "supergroup" },
          old_chat_member: { status: "left", user: { id: "10001" } },
          new_chat_member: { status: "member", user: { id: "10001" } }
        }
      }
    });

    expect(response.statusCode).toBe(401);
  });

  it("processes a valid membership update idempotently", async () => {
    const app = buildApp(createContainer(env, { persistence: "memory" }));

    const payload = {
      update_id: 1002,
      chat_member: {
        chat: { id: "-1000001", type: "supergroup" },
        old_chat_member: { status: "left", user: { id: "10003" } },
        new_chat_member: { status: "member", user: { id: "10003" } }
      }
    };

    const firstResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-secret"
      },
      payload
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-secret"
      },
      payload
    });
    const accessResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_expired"
    });

    expect(firstResponse.statusCode).toBe(202);
    expect(secondResponse.statusCode).toBe(200);
    expect(accessResponse.json().data.accessRecord.status).toBe("granted");
  });

  it("dispatches hard-coded commands from webhook messages to the bot sender", async () => {
    const sendMessage = vi.fn().mockResolvedValue({ ok: true });
    const telegramBot: TelegramBotLike = {
      sendMessage
    };
    const app = buildApp(
      createContainer(env, {
        persistence: "memory",
        telegramBot
      })
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-secret"
      },
      payload: {
        update_id: 1003,
        message: {
          chat: { id: 12345, type: "private" },
          text: "/plans@tradara_bot now"
        }
      }
    });

    expect(response.statusCode).toBe(202);
    expect(sendMessage).toHaveBeenCalledWith("12345", BOT_MESSAGES.plans);
  });

  it("handles edited messages and falls back for unknown commands", async () => {
    const sendMessage = vi.fn().mockResolvedValue({ ok: true });
    const telegramBot: TelegramBotLike = {
      sendMessage
    };
    const app = buildApp(
      createContainer(env, {
        persistence: "memory",
        telegramBot
      })
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/telegram",
      headers: {
        "x-telegram-bot-api-secret-token": "telegram-secret"
      },
      payload: {
        update_id: 1004,
        edited_message: {
          chat: { id: "chat-9", type: "private" },
          text: "/unknown@tradara_bot please"
        }
      }
    });

    expect(response.statusCode).toBe(202);
    expect(sendMessage).toHaveBeenCalledWith("chat-9", FALLBACK_MESSAGE);
  });
});
