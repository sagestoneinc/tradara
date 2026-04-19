import { BOT_MESSAGES, BOT_TELEGRAM_OPTIONS } from "./bot-messages";
import type { TelegramBotLike, TelegramChatId } from "../types/bot";

export interface ReminderFollowUpOptions {
  includeBitxexReminder?: boolean;
}

export async function sendBotMessage(
  bot: TelegramBotLike,
  chatId: TelegramChatId,
  text: string,
  options?: Record<string, unknown>
): Promise<void> {
  await bot.sendMessage(chatId, text, {
    ...BOT_TELEGRAM_OPTIONS,
    ...(options ?? {})
  });
}

export async function sendBitxexReminderIfEnabled(
  bot: TelegramBotLike,
  chatId: TelegramChatId,
  options?: ReminderFollowUpOptions
): Promise<void> {
  if (!options?.includeBitxexReminder) {
    return;
  }

  await sendBotMessage(bot, chatId, BOT_MESSAGES.bitxexReminder);
}
