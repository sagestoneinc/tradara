import type { AccountAccessSnapshot, AccountProfile } from "@tradara/shared-types";

import type {
  ChannelAccessRepository,
  SubscriptionRepository
} from "../../repositories/types";
import type { EntitlementService } from "../channel-access/entitlement.service";
import type { ClerkAuthService } from "./clerk-auth.service";

export class AccountService {
  constructor(
    private readonly clerkAuthService: ClerkAuthService,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly channelAccessRepository: ChannelAccessRepository,
    private readonly entitlementService: EntitlementService
  ) {}

  async getProfile(headers: Record<string, string | string[] | undefined>): Promise<AccountProfile> {
    const user = await this.clerkAuthService.requireAuthenticatedUser(headers);
    return { user };
  }

  async getAccess(headers: Record<string, string | string[] | undefined>): Promise<AccountAccessSnapshot> {
    const user = await this.clerkAuthService.requireAuthenticatedUser(headers);
    const [subscription, channelAccess] = await Promise.all([
      this.subscriptionRepository.findByUserId(user.id),
      this.channelAccessRepository.findByUserId(user.id)
    ]);
    const entitlement = this.entitlementService.resolve(subscription, user.id);

    return {
      user,
      subscription,
      entitlement,
      channelAccess,
      checklist: {
        hasBilling: subscription !== null,
        telegramLinked: user.telegramLinkState === "linked" || user.telegramUserId !== null,
        premiumAccessReady:
          entitlement.premiumChannelEligible &&
          (user.telegramLinkState === "linked" || user.telegramUserId !== null)
      }
    };
  }
}
