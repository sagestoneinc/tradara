import { BOT_MESSAGES } from "../content/bot-messages";
import {
  sendBitxexReminderIfEnabled,
  sendBotMessage,
  type ReminderFollowUpOptions
} from "../content/bot-message-delivery";
import type { BotCommandHandler } from "../types/bot";

export const handleUpgrade: BotCommandHandler = async (bot, chatId) => {
  await sendUpgradeResponse(bot, chatId);
};

export async function sendUpgradeResponse(
  bot: Parameters<BotCommandHandler>[0],
  chatId: Parameters<BotCommandHandler>[1],
  options?: ReminderFollowUpOptions
): Promise<void> {
  await sendBotMessage(bot, chatId, BOT_MESSAGES.upgrade);
  await sendBitxexReminderIfEnabled(bot, chatId, options);
}
