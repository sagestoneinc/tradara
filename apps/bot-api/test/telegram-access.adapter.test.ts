import { describe, expect, it, vi } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import {
  TelegramBotApiAccessAdapter,
  TelegramProviderError
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

describe("TelegramBotApiAccessAdapter", () => {
  it("creates a single-use invite link through the Bot API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        result: {
          invite_link: "https://t.me/+example"
        }
      })
    });

    const adapter = new TelegramBotApiAccessAdapter(
      env,
      fetchMock as unknown as typeof fetch,
      () => new Date("2026-04-18T12:00:00.000Z")
    );

    const result = await adapter.createInviteLink({
      channelId: "-1000001",
      telegramUserId: "10001",
      userId: "user_active"
    });

    expect(result.status).toBe("issued");
    expect(result.inviteUrl).toBe("https://t.me/+example");
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/createChatInviteLink");
  });

  it("removes a member by banning then unbanning them", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        result: true
      })
    });

    const adapter = new TelegramBotApiAccessAdapter(env, fetchMock as unknown as typeof fetch);

    const result = await adapter.revokeAccess({
      channelId: "-1000001",
      telegramUserId: "10001",
      userId: "user_active"
    });

    expect(result.status).toBe("revoked");
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0]?.[0]).toContain("/banChatMember");
    expect(fetchMock.mock.calls[1]?.[0]).toContain("/unbanChatMember");
  });

  it("classifies rate limits as retryable provider failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 429
    });

    const adapter = new TelegramBotApiAccessAdapter(env, fetchMock as unknown as typeof fetch);

    await expect(
      adapter.createInviteLink({
        channelId: "-1000001",
        telegramUserId: "10001",
        userId: "user_active"
      })
    ).rejects.toMatchObject({
      code: "telegram_rate_limited",
      failureKind: "retryable"
    });
  });

  it("classifies permission errors as non-retryable provider failures", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        ok: false,
        description: "Bad Request: not enough rights to manage chat invite link"
      })
    });

    const adapter = new TelegramBotApiAccessAdapter(env, fetchMock as unknown as typeof fetch);

    await expect(
      adapter.createInviteLink({
        channelId: "-1000001",
        telegramUserId: "10001",
        userId: "user_active"
      })
    ).rejects.toMatchObject({
      code: "telegram_permission_denied",
      failureKind: "non_retryable"
    });
  });
});
