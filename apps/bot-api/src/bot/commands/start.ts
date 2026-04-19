import { BOT_MESSAGES } from "../content/bot-messages";
import { sendBotMessage } from "../content/bot-message-delivery";
import { MAIN_MENU_KEYBOARD } from "../keyboards/main-menu";
import type { BotCommandHandler } from "../types/bot";

export const handleStart: BotCommandHandler = async (bot, chatId) => {
  await sendBotMessage(bot, chatId, BOT_MESSAGES.start, MAIN_MENU_KEYBOARD);
};
