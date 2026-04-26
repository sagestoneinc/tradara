import { BOT_MESSAGES, BOT_TELEGRAM_OPTIONS } from "../content/bot-messages";
import type { BotCommandHandler } from "../types/bot";

export const handleSignals: BotCommandHandler = async (bot, chatId): Promise<void> => {
  await bot.sendMessage(chatId, BOT_MESSAGES.signals, BOT_TELEGRAM_OPTIONS);
};
