import { BOT_MESSAGES } from "../content/bot-messages";
import {
  sendBitxexReminderIfEnabled,
  sendBotMessage,
  type ReminderFollowUpOptions
} from "../content/bot-message-delivery";
import type { BotCommandHandler } from "../types/bot";

export const handlePlans: BotCommandHandler = async (bot, chatId) => {
  await sendPlansResponse(bot, chatId);
};

export async function sendPlansResponse(
  bot: Parameters<BotCommandHandler>[0],
  chatId: Parameters<BotCommandHandler>[1],
  options?: ReminderFollowUpOptions
): Promise<void> {
  await sendBotMessage(bot, chatId, BOT_MESSAGES.plans);
  await sendBitxexReminderIfEnabled(bot, chatId, options);
}
