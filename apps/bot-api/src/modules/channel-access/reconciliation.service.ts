import type { ReconciliationAction } from "@tradara/shared-types";

import type { ChannelAccessRepository, SubscriptionRepository } from "../../repositories/types";
import type { ChannelAccessService } from "./channel-access.service";
import type { EntitlementService } from "./entitlement.service";

export class ChannelAccessReconciliationService {
  constructor(
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly channelAccessRepository: ChannelAccessRepository,
    private readonly entitlementService: EntitlementService,
    private readonly channelAccessService: ChannelAccessService
  ) {}

  async run(reason: string): Promise<ReconciliationAction[]> {
    const subscriptions = await this.subscriptionRepository.listAll();
    const accessRecords = await this.channelAccessRepository.listAll();
    const userIds = new Set([
      ...subscriptions.map((item) => item.userId),
      ...accessRecords.map((item) => item.userId)
    ]);

    const actions: ReconciliationAction[] = [];

    for (const userId of userIds) {
      const subscription = subscriptions.find((item) => item.userId === userId) ?? null;
      const accessRecord = accessRecords.find((item) => item.userId === userId) ?? null;
      const entitlement = this.entitlementService.resolve(subscription);

      if (entitlement.premiumChannelEligible && accessRecord?.status !== "granted") {
        const staged = await this.channelAccessService.stageDesiredState({
          userId,
          desiredState: "grant",
          telegramUserId: accessRecord?.telegramUserId,
          reason
        });
        await this.channelAccessService.executePendingGrant(
          userId,
          "channel-access-reconciliation"
        );
        actions.push({
          type: "grant",
          userId,
          reason: entitlement.reason,
          accessRecordId: staged.id
        });
        continue;
      }

      if (!entitlement.premiumChannelEligible && accessRecord && accessRecord.status !== "revoked") {
        const staged = await this.channelAccessService.stageDesiredState({
          userId,
          desiredState: "revoke",
          telegramUserId: accessRecord.telegramUserId,
          reason
        });
        await this.channelAccessService.executePendingRevoke(
          userId,
          "channel-access-reconciliation"
        );
        actions.push({
          type: "revoke",
          userId,
          reason: entitlement.reason,
          accessRecordId: staged.id
        });
        continue;
      }

      actions.push({
        type: "noop",
        userId,
        reason: entitlement.reason,
        accessRecordId: accessRecord?.id ?? null
      });
    }

    return actions;
  }
}
