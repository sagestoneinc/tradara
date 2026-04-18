import { describe, expect, it, vi } from "vitest";

import {
  commandRegistry,
  dispatchCommand,
  EXPECTED_COMMANDS,
  type SupportedCommand
} from "../src/bot/commands";
import { BOT_MESSAGES, FALLBACK_MESSAGE } from "../src/bot/content/bot-messages";
import { MAIN_MENU_KEYBOARD } from "../src/bot/keyboards/main-menu";
import type { TelegramBotLike } from "../src/bot/types/bot";

function createBotMock(): {
  bot: TelegramBotLike;
  sendMessage: ReturnType<typeof vi.fn>;
} {
  const sendMessage = vi.fn().mockResolvedValue({ ok: true });
  return {
    bot: {
      sendMessage
    },
    sendMessage
  };
}

describe("bot command foundation", () => {
  it("maps all expected commands in the registry", () => {
    expect(Object.keys(commandRegistry).sort()).toEqual([...EXPECTED_COMMANDS].sort());
  });

  it("each command handler sends the centralized message", async () => {
    const expectedMessageByCommand: Record<SupportedCommand, string> = {
      "/start": BOT_MESSAGES.start,
      "/plans": BOT_MESSAGES.plans,
      "/upgrade": BOT_MESSAGES.upgrade,
      "/faq": BOT_MESSAGES.faq,
      "/help": BOT_MESSAGES.help,
      "/risk": BOT_MESSAGES.risk,
      "/alerts": BOT_MESSAGES.alerts,
      "/status": BOT_MESSAGES.status
    };

    for (const command of EXPECTED_COMMANDS) {
      const { bot, sendMessage } = createBotMock();
      await commandRegistry[command](bot, "chat-123");

      expect(sendMessage).toHaveBeenCalledTimes(1);
      if (command === "/start") {
        expect(sendMessage).toHaveBeenCalledWith(
          "chat-123",
          expectedMessageByCommand[command],
          MAIN_MENU_KEYBOARD
        );
      } else {
        expect(sendMessage).toHaveBeenCalledWith("chat-123", expectedMessageByCommand[command]);
      }
    }
  });

  it("/start includes the main menu keyboard", async () => {
    const { bot, sendMessage } = createBotMock();
    await commandRegistry["/start"](bot, "chat-123");

    expect(sendMessage).toHaveBeenCalledWith("chat-123", BOT_MESSAGES.start, MAIN_MENU_KEYBOARD);
  });

  it("unknown commands send the fallback message", async () => {
    const { bot, sendMessage } = createBotMock();

    await dispatchCommand({
      bot,
      chatId: "chat-123",
      text: "/not-a-command"
    });

    expect(sendMessage).toHaveBeenCalledTimes(1);
    expect(sendMessage).toHaveBeenCalledWith("chat-123", FALLBACK_MESSAGE);
  });
});
