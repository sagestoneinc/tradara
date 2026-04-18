import type { BotApiEnv } from "@tradara/shared-config";
import type {
  AuditLog,
  ChannelAccessRecord,
  EntitlementSnapshot,
  SubscriptionSnapshot,
  TelegramInvite,
  TelegramInviteRequest
} from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import type {
  AuditLogRepository,
  ChannelAccessRepository,
  SubscriptionRepository,
  TelegramInviteRepository
} from "../../repositories/types";
import { EntitlementService } from "./entitlement.service";
import type { TelegramAccessAdapter } from "./telegram-access.adapter";

export interface ChannelAccessOverview {
  userId: string;
  subscription: SubscriptionSnapshot | null;
  entitlement: EntitlementSnapshot;
  accessRecord: ChannelAccessRecord | null;
}

export class ChannelAccessService {
  constructor(
    private readonly env: BotApiEnv,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly channelAccessRepository: ChannelAccessRepository,
    private readonly inviteRepository: TelegramInviteRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly entitlementService: EntitlementService,
    private readonly telegramAccessAdapter: TelegramAccessAdapter,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async getOverviewByUserId(userId: string): Promise<ChannelAccessOverview> {
    const subscription = await this.subscriptionRepository.findByUserId(userId);
    const accessRecord = await this.channelAccessRepository.findByUserId(userId);
    const entitlement = this.entitlementService.resolve(subscription, userId);

    if (!subscription) {
      return {
        userId,
        subscription: null,
        entitlement,
        accessRecord
      };
    }

    return {
      userId,
      subscription,
      entitlement,
      accessRecord
    };
  }

  async listOverview(): Promise<ChannelAccessOverview[]> {
    const subscriptions = await this.subscriptionRepository.listAll();
    const accessRecords = await this.channelAccessRepository.listAll();
    const userIds = new Set([
      ...subscriptions.map((item) => item.userId),
      ...accessRecords.map((item) => item.userId)
    ]);

    const entries = await Promise.all(
      [...userIds].map(async (userId) => this.getOverviewByUserId(userId))
    );

    return entries.sort((left, right) => left.userId.localeCompare(right.userId));
  }

  async issueInviteLink(request: TelegramInviteRequest): Promise<{
    entitlement: EntitlementSnapshot;
    accessRecord: ChannelAccessRecord;
    invite: TelegramInvite;
  }> {
    const overview = await this.getOverviewByUserId(request.userId);

    if (!overview.entitlement.premiumChannelEligible) {
      throw new DomainError(
        "Billing state does not currently allow premium Telegram access.",
        409,
        "access_not_entitled",
        {
          userId: request.userId,
          entitlement: overview.entitlement
        }
      );
    }

    const updatedAccessRecord = await this.channelAccessRepository.upsert({
      id: overview.accessRecord?.id ?? createId("access"),
      userId: request.userId,
      subscriptionId: overview.subscription?.id ?? null,
      channelId: request.channelId,
      telegramUserId: request.telegramUserId,
      status: "pending_grant",
      desiredState: "grant",
      inviteId: overview.accessRecord?.inviteId ?? null,
      lastSyncedAt: overview.accessRecord?.lastSyncedAt ?? null,
      lastError: null,
      updatedAt: isoNow(this.clock())
    });

    const adapterResult = await this.telegramAccessAdapter.createInviteLink({
      channelId: request.channelId,
      telegramUserId: request.telegramUserId,
      userId: request.userId
    });

    const invite: TelegramInvite = {
      id: createId("invite"),
      userId: request.userId,
      channelId: request.channelId,
      inviteUrl: adapterResult.inviteUrl,
      status: adapterResult.status === "issued" ? "issued" : "pending",
      expiresAt: null,
      note: adapterResult.note
    };

    await this.inviteRepository.save(invite);
    await this.channelAccessRepository.upsert({
      ...updatedAccessRecord,
      inviteId: invite.id
    });
    await this.appendAuditLog({
      actorType: "admin",
      actorId: "system-admin-ui",
      action: "channel_access.invite_requested",
      entityType: "channel_access",
      entityId: updatedAccessRecord.id,
      metadata: {
        userId: request.userId,
        channelId: request.channelId,
        inviteStatus: invite.status
      }
    });

    return {
      entitlement: overview.entitlement,
      accessRecord: {
        ...updatedAccessRecord,
        inviteId: invite.id
      },
      invite
    };
  }

  async stageDesiredState(input: {
    userId: string;
    desiredState: "grant" | "revoke";
    reason: string;
    telegramUserId?: string | null;
  }): Promise<ChannelAccessRecord> {
    const overview = await this.getOverviewByUserId(input.userId);
    const updatedRecord: ChannelAccessRecord = {
      id: overview.accessRecord?.id ?? createId("access"),
      userId: input.userId,
      subscriptionId: overview.subscription?.id ?? null,
      channelId: overview.accessRecord?.channelId ?? this.env.TELEGRAM_PREMIUM_CHANNEL_ID,
      telegramUserId: input.telegramUserId ?? overview.accessRecord?.telegramUserId ?? null,
      status: input.desiredState === "grant" ? "pending_grant" : "pending_revoke",
      desiredState: input.desiredState,
      inviteId: overview.accessRecord?.inviteId ?? null,
      lastSyncedAt: overview.accessRecord?.lastSyncedAt ?? null,
      lastError: null,
      updatedAt: isoNow(this.clock())
    };

    const saved = await this.channelAccessRepository.upsert(updatedRecord);
    await this.appendAuditLog({
      actorType: "job",
      actorId: "channel-access-reconciliation",
      action: `channel_access.${input.desiredState}_staged`,
      entityType: "channel_access",
      entityId: saved.id,
      metadata: {
        reason: input.reason,
        userId: input.userId
      }
    });

    return saved;
  }

  async applyMembershipObservation(input: {
    telegramUserId: string;
    memberState: "member" | "left";
    providerEventId: string;
  }): Promise<ChannelAccessRecord | null> {
    const accessRecord = await this.channelAccessRepository.findByTelegramUserId(input.telegramUserId);

    if (!accessRecord) {
      await this.appendAuditLog({
        actorType: "webhook",
        actorId: "telegram",
        action: "channel_access.membership_observation_unmatched",
        entityType: "telegram_membership",
        entityId: input.telegramUserId,
        metadata: {
          providerEventId: input.providerEventId,
          memberState: input.memberState
        }
      });
      return null;
    }

    const updated = await this.channelAccessRepository.upsert({
      ...accessRecord,
      status: input.memberState === "member" ? "granted" : "revoked",
      lastSyncedAt: isoNow(this.clock()),
      lastError: null,
      updatedAt: isoNow(this.clock())
    });

    await this.appendAuditLog({
      actorType: "webhook",
      actorId: "telegram",
      action: "channel_access.membership_observed",
      entityType: "channel_access",
      entityId: updated.id,
      metadata: {
        providerEventId: input.providerEventId,
        memberState: input.memberState
      }
    });

    return updated;
  }

  async listAuditLogs(limit = 25): Promise<AuditLog[]> {
    return this.auditLogRepository.listRecent(limit);
  }

  private async appendAuditLog(input: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    await this.auditLogRepository.append({
      id: createId("audit"),
      createdAt: isoNow(this.clock()),
      ...input
    });
  }
}
