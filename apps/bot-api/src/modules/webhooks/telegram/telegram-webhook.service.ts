import type { BotApiEnv } from "@tradara/shared-config";
import { createId, isoNow } from "@tradara/shared-utils";

import { dispatchCommand } from "../../../bot/commands";
import type { TelegramBotLike } from "../../../bot/types/bot";
import { DomainError } from "../../../lib/domain-error";
import { compareSecret, hashPayload } from "../../../lib/security";
import type { WebhookEventRepository } from "../../../repositories/types";
import type { ChannelAccessService } from "../../channel-access/channel-access.service";
import type { TelegramWebhookPayload } from "./telegram-webhook.schemas";

export class TelegramWebhookService {
  constructor(
    private readonly env: BotApiEnv,
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly channelAccessService: ChannelAccessService,
    private readonly telegramBot: TelegramBotLike,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async handleIncoming(secretToken: string | undefined, payload: TelegramWebhookPayload): Promise<{
    duplicate: boolean;
    observedMembershipChange: boolean;
  }> {
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

    if (payload.message?.text) {
      await dispatchCommand({
        bot: this.telegramBot,
        chatId: payload.message.chat.id,
        text: payload.message.text
      });
    }

    await this.webhookEventRepository.markProcessed(recorded.event.id, isoNow(this.clock()));

    return {
      duplicate: false,
      observedMembershipChange
    };
  }
}
