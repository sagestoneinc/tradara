import type { SubscriptionSnapshot } from "@tradara/shared-types";

import type { EntitlementSnapshot } from "@tradara/shared-types";

export class EntitlementService {
  constructor(private readonly clock: () => Date = () => new Date()) {}

  resolve(subscription: SubscriptionSnapshot | null, userId?: string): EntitlementSnapshot {
    const resolvedUserId = subscription?.userId ?? userId ?? "unknown";

    if (!subscription) {
      return {
        userId: resolvedUserId,
        status: "inactive",
        sourceSubscriptionId: null,
        premiumChannelEligible: false,
        gracePeriodEndsAt: null,
        reason: "No billing record is present for this user."
      };
    }

    const now = this.clock();
    const currentPeriodEndsAt = new Date(subscription.currentPeriodEndsAt);
    const gracePeriodEndsAt = subscription.gracePeriodEndsAt
      ? new Date(subscription.gracePeriodEndsAt)
      : null;

    if (subscription.status === "active" || subscription.status === "trialing") {
      return {
        userId: subscription.userId,
        status: "active",
        sourceSubscriptionId: subscription.id,
        premiumChannelEligible: true,
        gracePeriodEndsAt: null,
        reason: "Subscription is currently in good standing."
      };
    }

    if (subscription.status === "canceled" && currentPeriodEndsAt >= now) {
      return {
        userId: subscription.userId,
        status: "active",
        sourceSubscriptionId: subscription.id,
        premiumChannelEligible: true,
        gracePeriodEndsAt: null,
        reason: "Subscription is canceled but still inside the paid access window."
      };
    }

    if (
      (subscription.status === "past_due" || subscription.status === "grace_period") &&
      gracePeriodEndsAt &&
      gracePeriodEndsAt >= now
    ) {
      return {
        userId: subscription.userId,
        status: "grace_period",
        sourceSubscriptionId: subscription.id,
        premiumChannelEligible: true,
        gracePeriodEndsAt: gracePeriodEndsAt.toISOString(),
        reason: "Subscription is in grace period while payment recovery is pending."
      };
    }

    return {
      userId: subscription.userId,
      status: "inactive",
      sourceSubscriptionId: subscription.id,
      premiumChannelEligible: false,
      gracePeriodEndsAt: gracePeriodEndsAt?.toISOString() ?? null,
      reason: "Billing state does not currently grant premium Telegram access."
    };
  }
}
