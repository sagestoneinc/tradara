import { BOT_MESSAGES, buildUpgradeMessage } from "../content/bot-messages";
import {
  sendBitxexReminderIfEnabled,
  sendBotMessage,
  type ReminderFollowUpOptions
} from "../content/bot-message-delivery";
import type { BotCommandHandler } from "../types/bot";

export const handleUpgrade: BotCommandHandler = async (bot, chatId, context) => {
  await sendUpgradeResponse(bot, chatId, undefined, context);
};

export async function sendUpgradeResponse(
  bot: Parameters<BotCommandHandler>[0],
  chatId: Parameters<BotCommandHandler>[1],
  options?: ReminderFollowUpOptions,
  context?: Parameters<BotCommandHandler>[2]
): Promise<void> {
  const message = context?.marketingSiteBaseUrl
    ? buildUpgradeMessage(context.marketingSiteBaseUrl)
    : BOT_MESSAGES.upgrade;

  await sendBotMessage(bot, chatId, message);
  await sendBitxexReminderIfEnabled(bot, chatId, options);
}
