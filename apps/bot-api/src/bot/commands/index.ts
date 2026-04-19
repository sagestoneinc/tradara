import { FALLBACK_MESSAGE } from "../content/bot-messages";
import type { BotCommandContext, BotCommandHandler, TelegramBotLike, TelegramChatId } from "../types/bot";
import { handleAlerts } from "./alerts";
import { handleFaq } from "./faq";
import { handleHelp } from "./help";
import { handlePlans } from "./plans";
import { handleRisk } from "./risk";
import { handleStart } from "./start";
import { handleStatus } from "./status";
import { handleUpgrade } from "./upgrade";

export const EXPECTED_COMMANDS = [
  "/start",
  "/plans",
  "/upgrade",
  "/faq",
  "/help",
  "/risk",
  "/alerts",
  "/status"
] as const;

export type SupportedCommand = (typeof EXPECTED_COMMANDS)[number];

export const commandRegistry = {
  "/start": handleStart,
  "/plans": handlePlans,
  "/upgrade": handleUpgrade,
  "/faq": handleFaq,
  "/help": handleHelp,
  "/risk": handleRisk,
  "/alerts": handleAlerts,
  "/status": handleStatus
} as const satisfies Record<SupportedCommand, BotCommandHandler>;

export async function dispatchCommand(input: {
  bot: TelegramBotLike;
  chatId: TelegramChatId;
  text: string;
  context?: BotCommandContext;
  logger?: Pick<Console, "info" | "warn">;
}): Promise<void> {
  const command = normalizeCommand(input.text);
  const handler = command ? commandRegistry[command] : undefined;
  const logger = input.logger ?? console;

  logger.info("[tradara.telegram.command.dispatch]", {
    chatId: String(input.chatId),
    text: input.text,
    normalizedCommand: command,
    handlerFound: Boolean(handler)
  });

  if (handler) {
    await handler(input.bot, input.chatId, input.context);
    return;
  }

  await input.bot.sendMessage(input.chatId, FALLBACK_MESSAGE);
}

export function normalizeCommand(text: string): SupportedCommand | null {
  const firstToken = text.trim().split(/\s+/u)[0] ?? "";

  if (!firstToken.startsWith("/")) {
    return null;
  }

  const baseCommand = firstToken.split("@")[0]?.toLowerCase() ?? "";
  return isSupportedCommand(baseCommand) ? baseCommand : null;
}

function isSupportedCommand(command: string): command is SupportedCommand {
  return EXPECTED_COMMANDS.includes(command as SupportedCommand);
}
