import type { SignalReviewRequest, SignalReviewSnapshot, SignalSnapshot, SignalStatus } from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import type { SignalRepository, SignalReviewRepository } from "../../repositories/types";
import { DomainError } from "../../lib/domain-error";

const REVIEW_ACTION_TO_STATUS: Record<SignalReviewRequest["action"], SignalStatus> = {
  approve: "approved",
  edit: "edited",
  reject: "rejected",
  cancel: "canceled"
};

export class SignalReviewService {
  constructor(
    private readonly signalRepository: SignalRepository,
    private readonly signalReviewRepository: SignalReviewRepository,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async submitReview(signalId: string, input: SignalReviewRequest): Promise<{
    signal: SignalSnapshot;
    review: SignalReviewSnapshot;
  }> {
    const signal = await this.signalRepository.findById(signalId);
    if (!signal) {
      throw new DomainError("Signal not found.", 404, "signal_not_found");
    }

    const canReview =
      input.action === "cancel"
        ? ["draft", "ai_scored", "pending_review", "approved", "edited"].includes(signal.status)
        : signal.status === "pending_review";

    if (!canReview) {
      throw new DomainError("Signal is not reviewable.", 409, "invalid_signal_state");
    }

    const resultingStatus = REVIEW_ACTION_TO_STATUS[input.action];
    const now = isoNow(this.clock());
    const review: SignalReviewSnapshot = {
      id: createId("signal_review"),
      signalId,
      reviewerId: input.reviewerId,
      resultingStatus,
      notes: input.notes ?? null,
      editedTelegramDraft: input.editedTelegramDraft ?? null,
      createdAt: now
    };

    const nextSignal: SignalSnapshot = {
      ...signal,
      status: resultingStatus,
      expertReviewNotes: input.notes ?? signal.expertReviewNotes,
      editedTelegramDraft: input.action === "edit" ? input.editedTelegramDraft ?? signal.telegramDraft : signal.editedTelegramDraft,
      approvedBy: resultingStatus === "approved" || resultingStatus === "edited" ? input.reviewerId : signal.approvedBy,
      approvedAt: resultingStatus === "approved" || resultingStatus === "edited" ? now : signal.approvedAt,
      rejectedBy: resultingStatus === "rejected" ? input.reviewerId : signal.rejectedBy,
      rejectedAt: resultingStatus === "rejected" ? now : signal.rejectedAt,
      canceledAt: resultingStatus === "canceled" ? now : signal.canceledAt,
      updatedAt: now
    };

    await this.signalReviewRepository.save(review);
    await this.signalRepository.save(nextSignal);

    return { signal: nextSignal, review };
  }
}
