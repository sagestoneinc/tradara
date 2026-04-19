import type { BotApiEnv } from "@tradara/shared-config";

import { DomainError } from "../lib/domain-error";
import type { TelegramBotLike } from "./types/bot";

interface TelegramSendMessageResponse {
  ok: boolean;
  description?: string;
}

export class TelegramBotApiAdapter implements TelegramBotLike {
  constructor(
    private readonly env: BotApiEnv,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly logger: Pick<Console, "info" | "error"> = console
  ) {}

  async sendMessage(
    chatId: string | number,
    text: string,
    options?: Record<string, unknown>
  ): Promise<unknown> {
    this.logger.info("[tradara.telegram.bot.send.attempt]", {
      chatId: String(chatId),
      hasOptions: Boolean(options)
    });

    const response = await this.fetchImpl(
      `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          ...(options ?? {})
        })
      }
    );

    if (!response.ok) {
      this.logger.error("[tradara.telegram.bot.send.http_error]", {
        chatId: String(chatId),
        status: response.status
      });
      throw new DomainError(
        `Telegram sendMessage failed with status ${response.status}.`,
        502,
        "telegram_send_failed"
      );
    }

    const payload = (await response.json()) as TelegramSendMessageResponse;
    if (!payload.ok) {
      this.logger.error("[tradara.telegram.bot.send.provider_error]", {
        chatId: String(chatId),
        description: payload.description ?? null
      });
      throw new DomainError(
        payload.description ?? "Telegram sendMessage failed.",
        502,
        "telegram_send_failed"
      );
    }

    this.logger.info("[tradara.telegram.bot.send.succeeded]", {
      chatId: String(chatId)
    });

    return payload;
  }
}

export class StubTelegramBotAdapter implements TelegramBotLike {
  async sendMessage(): Promise<unknown> {
    return { ok: true };
  }
}
