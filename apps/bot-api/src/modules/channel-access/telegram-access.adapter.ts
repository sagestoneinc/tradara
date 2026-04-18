import type { BotApiEnv } from "@tradara/shared-config";
import type { TelegramFailureKind } from "@tradara/shared-types";

export interface CreateInviteLinkInput {
  channelId: string;
  telegramUserId: string;
  userId: string;
}

export interface RevokeAccessInput {
  channelId: string;
  telegramUserId: string;
  userId: string;
}

export interface InviteLinkResult {
  status: "issued" | "pending_implementation";
  inviteUrl: string | null;
  note: string;
}

export interface RevokeAccessResult {
  status: "revoked" | "pending_implementation";
  note: string;
}

export interface TelegramAccessAdapter {
  createInviteLink(input: CreateInviteLinkInput): Promise<InviteLinkResult>;
  revokeAccess(input: RevokeAccessInput): Promise<RevokeAccessResult>;
}

export class TelegramProviderError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly failureKind: TelegramFailureKind,
    public readonly method: string,
    public readonly providerStatusCode?: number
  ) {
    super(message);
    this.name = "TelegramProviderError";
  }
}

interface TelegramApiResponse<TData> {
  ok: boolean;
  description?: string;
  result?: TData;
}

interface TelegramInviteLinkPayload {
  invite_link: string;
}

export class TelegramBotApiAccessAdapter implements TelegramAccessAdapter {
  constructor(
    private readonly env: BotApiEnv,
    private readonly fetchImpl: typeof fetch = fetch,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async createInviteLink(input: CreateInviteLinkInput): Promise<InviteLinkResult> {
    const expireDate = Math.floor(this.clock().getTime() / 1000) + 60 * 60 * 24;
    const response = await this.callTelegram<TelegramInviteLinkPayload>("createChatInviteLink", {
      chat_id: input.channelId,
      name: `tradara:${input.userId}`,
      expire_date: expireDate,
      member_limit: 1
    });

    return {
      status: "issued",
      inviteUrl: response.invite_link,
      note: "Telegram invite link issued through the live Bot API."
    };
  }

  async revokeAccess(input: RevokeAccessInput): Promise<RevokeAccessResult> {
    await this.callTelegram("banChatMember", {
      chat_id: input.channelId,
      user_id: input.telegramUserId,
      revoke_messages: false
    });
    await this.callTelegram("unbanChatMember", {
      chat_id: input.channelId,
      user_id: input.telegramUserId,
      only_if_banned: true
    });

    return {
      status: "revoked",
      note: "Telegram member access revoked through the live Bot API."
    };
  }

  private async callTelegram<TData = boolean>(
    method: string,
    payload: Record<string, unknown>
  ): Promise<TData> {
    let response: Response;
    try {
      response = await this.fetchImpl(
        `https://api.telegram.org/bot${this.env.TELEGRAM_BOT_TOKEN}/${method}`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json"
          },
          body: JSON.stringify(payload)
        }
      );
    } catch (error) {
      throw new TelegramProviderError(
        error instanceof Error ? error.message : "Telegram network request failed.",
        "telegram_network_error",
        "retryable",
        method
      );
    }

    if (!response.ok) {
      throw new TelegramProviderError(
        `Telegram Bot API request failed with status ${response.status}.`,
        this.classifyStatusCode(response.status).code,
        this.classifyStatusCode(response.status).failureKind,
        method,
        response.status
      );
    }

    const body = (await response.json()) as TelegramApiResponse<TData>;
    if (!body.ok || body.result === undefined) {
      const classification = this.classifyDescription(body.description);
      throw new TelegramProviderError(
        body.description ?? "Telegram Bot API rejected the request.",
        classification.code,
        classification.failureKind,
        method,
        response.status
      );
    }

    return body.result;
  }

  private classifyStatusCode(statusCode: number): {
    code: string;
    failureKind: TelegramFailureKind;
  } {
    if (statusCode === 429 || statusCode >= 500) {
      return {
        code: statusCode === 429 ? "telegram_rate_limited" : "telegram_provider_unavailable",
        failureKind: "retryable"
      };
    }

    if (statusCode === 401 || statusCode === 403) {
      return {
        code: "telegram_permission_denied",
        failureKind: "non_retryable"
      };
    }

    if (statusCode === 404) {
      return {
        code: "telegram_target_not_found",
        failureKind: "non_retryable"
      };
    }

    return {
      code: "telegram_invalid_request",
      failureKind: "non_retryable"
    };
  }

  private classifyDescription(description?: string): {
    code: string;
    failureKind: TelegramFailureKind;
  } {
    const normalized = description?.toLowerCase() ?? "";
    if (normalized.includes("too many requests")) {
      return {
        code: "telegram_rate_limited",
        failureKind: "retryable"
      };
    }

    if (
      normalized.includes("not enough rights") ||
      normalized.includes("have no rights") ||
      normalized.includes("administrator rights")
    ) {
      return {
        code: "telegram_permission_denied",
        failureKind: "non_retryable"
      };
    }

    if (
      normalized.includes("user not found") ||
      normalized.includes("chat not found") ||
      normalized.includes("member not found")
    ) {
      return {
        code: "telegram_target_not_found",
        failureKind: "non_retryable"
      };
    }

    return {
      code: "telegram_provider_error",
      failureKind: "non_retryable"
    };
  }
}

export class StubTelegramAccessAdapter implements TelegramAccessAdapter {
  async createInviteLink(): Promise<InviteLinkResult> {
    return {
      status: "pending_implementation",
      inviteUrl: null,
      note: "Telegram invite-link creation is scaffolded but not connected to the live Bot API yet."
    };
  }

  async revokeAccess(): Promise<RevokeAccessResult> {
    return {
      status: "pending_implementation",
      note: "Telegram member revocation is scaffolded but not connected to the live Bot API yet."
    };
  }
}
