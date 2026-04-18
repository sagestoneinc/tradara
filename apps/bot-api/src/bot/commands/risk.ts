import { BOT_MESSAGES } from "../content/bot-messages";
import type { BotCommandHandler } from "../types/bot";

export const handleRisk: BotCommandHandler = async (bot, chatId) => {
  await bot.sendMessage(chatId, BOT_MESSAGES.risk);
};
