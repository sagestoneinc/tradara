import { BOT_MESSAGES } from "../content/bot-messages";
import { MAIN_MENU_KEYBOARD } from "../keyboards/main-menu";
import type { BotCommandHandler } from "../types/bot";

export const handleStart: BotCommandHandler = async (bot, chatId) => {
  await bot.sendMessage(chatId, BOT_MESSAGES.start, MAIN_MENU_KEYBOARD);
};
