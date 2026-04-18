import type { TelegramBotLike } from "./types/bot";

export class StubTelegramBotAdapter implements TelegramBotLike {
  async sendMessage(): Promise<unknown> {
    return { ok: true };
  }
}
