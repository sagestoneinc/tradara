import type { SignalPublishMetadata, SignalSnapshot } from "@tradara/shared-types";
import { isoNow } from "@tradara/shared-utils";

import type { SignalRepository } from "../../repositories/types";
import { DomainError } from "../../lib/domain-error";

export class SignalPublishingService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly clock: () => Date = () => new Date()
  ) {}

  canPublish(signal: SignalSnapshot): boolean {
    return signal.status === "approved" || signal.status === "edited";
  }

  async publish(
    signalId: string,
    input: { publisherId: string; chatId: string; messageId: string }
  ): Promise<{ signal: SignalSnapshot; publishMetadata: SignalPublishMetadata }> {
    const signal = await this.signalRepository.findById(signalId);
    if (!signal) {
      throw new DomainError("Signal not found.", 404, "signal_not_found");
    }

    if (!this.canPublish(signal)) {
      throw new DomainError("Only approved or edited signals can be published.", 409, "invalid_signal_state");
    }

    const publishedAt = isoNow(this.clock());
    const publishMetadata: SignalPublishMetadata = {
      chatId: input.chatId,
      messageId: input.messageId,
      publishedAt
    };

    const nextSignal: SignalSnapshot = {
      ...signal,
      status: "published",
      publishedBy: input.publisherId,
      publishedAt,
      publishedTelegramText: signal.editedTelegramDraft ?? signal.telegramDraft,
      publishedTelegramChatId: input.chatId,
      publishedTelegramMessageId: input.messageId,
      metadata: {
        ...signal.metadata,
        publishMetadata
      },
      updatedAt: publishedAt
    };

    await this.signalRepository.save(nextSignal);

    return { signal: nextSignal, publishMetadata };
  }
}
