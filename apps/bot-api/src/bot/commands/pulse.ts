import { BOT_MESSAGES, BOT_TELEGRAM_OPTIONS } from "../content/bot-messages";
import type { BotCommandHandler } from "../types/bot";

export const handlePulse: BotCommandHandler = async (bot, chatId): Promise<void> => {
  await bot.sendMessage(chatId, BOT_MESSAGES.pulse, BOT_TELEGRAM_OPTIONS);
};
