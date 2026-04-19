export type TelegramChatId = number | string;

export interface TelegramBotLike {
  sendMessage: (
    chatId: TelegramChatId,
    text: string,
    options?: Record<string, unknown>
  ) => Promise<unknown>;
}

export interface BotCommandContext {
  marketingSiteBaseUrl?: string;
}

export type BotCommandHandler = (
  bot: TelegramBotLike,
  chatId: TelegramChatId,
  context?: BotCommandContext
) => Promise<void>;
