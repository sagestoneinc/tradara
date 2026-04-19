import type { AuditLog, SignalPublishMetadata, SignalSnapshot } from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import type { AuditLogRepository, SignalRepository } from "../../repositories/types";
import type { TelegramBotLike } from "../../bot/types/bot";
import { DomainError } from "../../lib/domain-error";

const NOOP_AUDIT_REPOSITORY: AuditLogRepository = {
  async append(): Promise<void> {},
  async listRecent(): Promise<AuditLog[]> {
    return [];
  }
};

const STUB_SIGNAL_TELEGRAM_BOT: TelegramBotLike = {
  async sendMessage(): Promise<{ result: { message_id: string } }> {
    return {
      result: {
        message_id: createId("tg_msg")
      }
    };
  }
};

export class SignalPublishingService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly auditLogRepository: AuditLogRepository = NOOP_AUDIT_REPOSITORY,
    private readonly telegramBot: TelegramBotLike = STUB_SIGNAL_TELEGRAM_BOT,
    private readonly premiumChannelId = "tradara-signal-preview",
    private readonly clock: () => Date = () => new Date()
  ) {}

  canPublish(signal: SignalSnapshot): boolean {
    return signal.status === "approved" || signal.status === "edited";
  }

  async publish(
    signalId: string,
    input: { publisherId: string }
  ): Promise<{ signal: SignalSnapshot; publishMetadata: SignalPublishMetadata }> {
    const signal = await this.signalRepository.findById(signalId);
    if (!signal) {
      throw new DomainError("Signal not found.", 404, "signal_not_found");
    }

    if (!this.canPublish(signal)) {
      throw new DomainError("Only approved or edited signals can be published.", 409, "invalid_signal_state");
    }

    const text = signal.editedTelegramDraft ?? signal.telegramDraft;
    if (!text) {
      throw new DomainError("Signal has no formatted Telegram message.", 409, "missing_telegram_draft");
    }

    await this.appendAuditLog(input.publisherId, "signal.publish_attempt", signal.id, {
      signalId: signal.id,
      status: signal.status
    });

    try {
      const response = (await this.telegramBot.sendMessage(this.premiumChannelId, text, {
        parse_mode: "Markdown",
        disable_web_page_preview: true
      })) as { result?: { message_id?: number | string } };
      const publishedAt = isoNow(this.clock());
      const publishMetadata: SignalPublishMetadata = {
        chatId: this.premiumChannelId,
        messageId: String(response?.result?.message_id ?? createId("tg_msg")),
        publishedAt
      };

      const nextSignal: SignalSnapshot = {
        ...signal,
        status: "published",
        publishedBy: input.publisherId,
        publishedAt,
        publishedTelegramText: text,
        publishedTelegramChatId: publishMetadata.chatId,
        publishedTelegramMessageId: publishMetadata.messageId,
        metadata: {
          ...signal.metadata,
          publishMetadata,
          lastPublishFailure: null
        },
        updatedAt: publishedAt
      };

      await this.signalRepository.save(nextSignal);
      await this.appendAuditLog(input.publisherId, "signal.publish_succeeded", signal.id, {
        signalId: signal.id,
        chatId: publishMetadata.chatId,
        messageId: publishMetadata.messageId
      });

      return { signal: nextSignal, publishMetadata };
    } catch (error) {
      const failedAt = isoNow(this.clock());
      const nextSignal: SignalSnapshot = {
        ...signal,
        metadata: {
          ...signal.metadata,
          lastPublishFailure: {
            message: error instanceof Error ? error.message : "Unknown publish failure",
            failedAt
          }
        },
        updatedAt: failedAt
      };
      await this.signalRepository.save(nextSignal);
      await this.appendAuditLog(input.publisherId, "signal.publish_failed", signal.id, {
        signalId: signal.id,
        error: error instanceof Error ? error.message : "Unknown publish failure"
      });
      throw error;
    }
  }

  private async appendAuditLog(
    actorId: string,
    action: string,
    entityId: string,
    metadata: Record<string, unknown>
  ): Promise<void> {
    await this.auditLogRepository.append({
      id: createId("audit"),
      actorType: "admin",
      actorId,
      action,
      entityType: "signal",
      entityId,
      metadata,
      createdAt: isoNow(this.clock())
    });
  }
}
