import type { BotApiEnv } from "@tradara/shared-config";
import { createId, isoNow } from "@tradara/shared-utils";

import { dispatchCommand } from "../../../bot/commands";
import { TELEGRAM_LINK_MESSAGES } from "../../../bot/content/bot-messages";
import { sendBotMessage } from "../../../bot/content/bot-message-delivery";
import type { TelegramBotLike } from "../../../bot/types/bot";
import { DomainError } from "../../../lib/domain-error";
import { compareSecret, hashPayload } from "../../../lib/security";
import type { WebhookEventRepository } from "../../../repositories/types";
import type { ChannelAccessService } from "../../channel-access/channel-access.service";
import type { ClerkAuthService } from "../../auth/clerk-auth.service";
import type { TelegramWebhookPayload } from "./telegram-webhook.schemas";

export class TelegramWebhookService {
  constructor(
    private readonly env: BotApiEnv,
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly channelAccessService: ChannelAccessService,
    private readonly telegramBot: TelegramBotLike,
    private readonly clerkAuthService: ClerkAuthService,
    private readonly clock: () => Date = () => new Date(),
    private readonly logger: Pick<Console, "info" | "warn" | "error"> = console
  ) {}

  async handleIncoming(secretToken: string | undefined, payload: TelegramWebhookPayload): Promise<{
    duplicate: boolean;
    observedMembershipChange: boolean;
  }> {
    this.logger.info("[tradara.telegram.webhook.received]", {
      updateId: payload.update_id,
      hasMessage: Boolean(payload.message),
      hasEditedMessage: Boolean(payload.edited_message),
      hasChatMember: Boolean(payload.chat_member)
    });

    if (!compareSecret(secretToken, this.env.TELEGRAM_WEBHOOK_SECRET)) {
      throw new DomainError("Webhook secret verification failed.", 401, "invalid_signature");
    }

    const recorded = await this.webhookEventRepository.recordIncoming({
      id: createId("wh"),
      provider: "telegram",
      providerEventId: payload.update_id,
      signatureValid: true,
      payloadHash: hashPayload(payload),
      processedAt: null,
      receivedAt: isoNow(this.clock())
    });

    if (recorded.duplicate) {
      return {
        duplicate: true,
        observedMembershipChange: false
      };
    }

    const memberUpdate = payload.chat_member ?? null;
    let observedMembershipChange = false;

    if (
      memberUpdate &&
      memberUpdate.chat.id === this.env.TELEGRAM_PREMIUM_CHANNEL_ID &&
      memberUpdate.new_chat_member.user?.id
    ) {
      const status = memberUpdate.new_chat_member.status;
      const memberState = ["member", "administrator", "creator"].includes(status)
        ? "member"
        : "left";

      await this.channelAccessService.applyMembershipObservation({
        telegramUserId: memberUpdate.new_chat_member.user.id,
        memberState,
        providerEventId: payload.update_id
      });
      observedMembershipChange = true;
    }

    const inboundMessage = this.extractInboundMessage(payload);
    if (inboundMessage) {
      const linkToken = this.extractTelegramLinkToken(inboundMessage.text);
      if (linkToken) {
        await this.handleTelegramLinkCompletion(inboundMessage.chatId, linkToken);
      } else {
      this.logger.info("[tradara.telegram.webhook.command_message]", {
        updateId: payload.update_id,
        source: inboundMessage.source,
        text: inboundMessage.text
      });

      await dispatchCommand({
        bot: this.telegramBot,
        chatId: inboundMessage.chatId,
        text: inboundMessage.text,
        context: {
          marketingSiteBaseUrl: this.env.MARKETING_SITE_BASE_URL
        },
        logger: this.logger
      });
      }
    } else {
      this.logger.warn("[tradara.telegram.webhook.no_command_message]", {
        updateId: payload.update_id
      });
    }

    await this.webhookEventRepository.markProcessed(recorded.event.id, isoNow(this.clock()));

    return {
      duplicate: false,
      observedMembershipChange
    };
  }

  private extractInboundMessage(payload: TelegramWebhookPayload): {
    chatId: string;
    text: string;
    source: "message" | "edited_message";
  } | null {
    if (payload.message?.text) {
      return {
        chatId: payload.message.chat.id,
        text: payload.message.text,
        source: "message"
      };
    }

    if (payload.edited_message?.text) {
      return {
        chatId: payload.edited_message.chat.id,
        text: payload.edited_message.text,
        source: "edited_message"
      };
    }

    return null;
  }

  private extractTelegramLinkToken(text: string): string | null {
    const parts = text.trim().split(/\s+/u);
    if (parts[0]?.toLowerCase() !== "/start") {
      return null;
    }

    const token = parts[1];
    if (!token?.startsWith("link_")) {
      return null;
    }

    return token.slice("link_".length).trim() || null;
  }

  private async handleTelegramLinkCompletion(chatId: string, token: string): Promise<void> {
    const result = await this.clerkAuthService.completeTelegramLink({
      token,
      telegramUserId: chatId
    });

    switch (result.outcome) {
      case "linked":
        await sendBotMessage(
          this.telegramBot,
          chatId,
          result.premiumAccessReady
            ? TELEGRAM_LINK_MESSAGES.linked
            : TELEGRAM_LINK_MESSAGES.linkedPendingBilling
        );
        return;
      case "already_linked":
        await sendBotMessage(this.telegramBot, chatId, TELEGRAM_LINK_MESSAGES.alreadyLinked);
        return;
      case "expired":
        await sendBotMessage(this.telegramBot, chatId, TELEGRAM_LINK_MESSAGES.expired);
        return;
      case "invalid":
        await sendBotMessage(this.telegramBot, chatId, TELEGRAM_LINK_MESSAGES.invalid);
        return;
    }
  }
}
