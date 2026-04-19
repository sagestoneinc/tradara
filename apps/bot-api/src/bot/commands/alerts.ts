import { BOT_MESSAGES } from "../content/bot-messages";
import { sendBotMessage } from "../content/bot-message-delivery";
import type { BotCommandHandler } from "../types/bot";

export const handleAlerts: BotCommandHandler = async (bot, chatId) => {
  await sendBotMessage(bot, chatId, BOT_MESSAGES.alerts);
};
