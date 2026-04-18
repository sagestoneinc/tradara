import type { BotApiEnv } from "@tradara/shared-config";
import type {
  AuditLog,
  ChannelAccessRecord,
  EntitlementSnapshot,
  SubscriptionSnapshot,
  TelegramFailureKind,
  TelegramInvite,
  TelegramInviteRequest,
  TelegramExecutionStatus
} from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import type {
  AuditLogRepository,
  ChannelAccessRepository,
  SubscriptionRepository,
  TelegramInviteRepository
} from "../../repositories/types";
import type { EntitlementService } from "./entitlement.service";
import {
  TelegramProviderError,
  type TelegramAccessAdapter
} from "./telegram-access.adapter";

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
    private readonly clock: () => Date = () => new Date(),
    private readonly sleep: (ms: number) => Promise<void> = (ms) =>
      new Promise((resolve) => setTimeout(resolve, ms))
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

    const invite = await this.createInviteForAccessRecord(updatedAccessRecord, {
      actorType: "admin",
      actorId: "system-admin-ui"
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

  async executePendingGrant(userId: string, actorId: string): Promise<ChannelAccessRecord | null> {
    const overview = await this.getOverviewByUserId(userId);
    const accessRecord = overview.accessRecord;

    if (!overview.entitlement.premiumChannelEligible || !accessRecord?.telegramUserId) {
      return accessRecord;
    }

    if (accessRecord.inviteId) {
      return accessRecord;
    }

    await this.createInviteForAccessRecord(accessRecord, {
      actorType: "job",
      actorId
    });

    return this.channelAccessRepository.findByUserId(userId);
  }

  async executePendingRevoke(userId: string, actorId: string): Promise<ChannelAccessRecord | null> {
    const overview = await this.getOverviewByUserId(userId);
    const accessRecord = overview.accessRecord;

    if (!accessRecord?.telegramUserId || accessRecord.desiredState !== "revoke") {
      return accessRecord;
    }

    const correlationId = createId("trace");
    const execution = await this.executeWithRetry(
      accessRecord,
      {
        actorType: "job",
        actorId
      },
      "revoke",
      correlationId,
      () =>
        this.telegramAccessAdapter.revokeAccess({
          channelId: accessRecord.channelId,
          telegramUserId: accessRecord.telegramUserId!,
          userId
        })
    );

    const updated = await this.channelAccessRepository.upsert({
      ...execution.record,
      status:
        execution.outcome === "success"
          ? "revoked"
          : execution.failureKind === "non_retryable"
            ? "error"
            : "pending_revoke",
      lastSyncedAt: execution.outcome === "success" ? isoNow(this.clock()) : accessRecord.lastSyncedAt,
      updatedAt: isoNow(this.clock())
    });

    return updated;
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

  private async createInviteForAccessRecord(
    accessRecord: ChannelAccessRecord,
    actor: {
      actorType: AuditLog["actorType"];
      actorId: string;
    }
  ): Promise<TelegramInvite> {
    if (!accessRecord.telegramUserId) {
      throw new DomainError(
        "Telegram user ID is required before issuing an invite link.",
        409,
        "telegram_identity_missing",
        {
          userId: accessRecord.userId
        }
      );
    }

    const correlationId = createId("trace");
    const execution = await this.executeWithRetry(
      accessRecord,
      actor,
      "grant",
      correlationId,
      () =>
        this.telegramAccessAdapter.createInviteLink({
          channelId: accessRecord.channelId,
          telegramUserId: accessRecord.telegramUserId!,
          userId: accessRecord.userId
        })
    );

    if (execution.outcome !== "success") {
      throw new DomainError(
        execution.record.lastError ?? "Telegram invite execution failed.",
        502,
        execution.record.lastErrorCode ?? "telegram_provider_error",
        {
          userId: accessRecord.userId,
          correlationId
        }
      );
    }

    const invite: TelegramInvite = {
      id: createId("invite"),
      userId: accessRecord.userId,
      channelId: accessRecord.channelId,
      inviteUrl: execution.result.inviteUrl,
      status: execution.result.status === "issued" ? "issued" : "pending",
      expiresAt: null,
      note: execution.result.note
    };

    await this.inviteRepository.save(invite);
    await this.channelAccessRepository.upsert({
      ...execution.record,
      inviteId: invite.id,
      updatedAt: isoNow(this.clock())
    });
    await this.appendAuditLog({
      actorType: actor.actorType,
      actorId: actor.actorId,
      action: "channel_access.invite_requested",
      entityType: "channel_access",
      entityId: accessRecord.id,
      metadata: {
        userId: accessRecord.userId,
        channelId: accessRecord.channelId,
        inviteStatus: invite.status,
        correlationId
      }
    });

    return invite;
  }

  private async executeWithRetry<TResult extends { note: string }>(
    accessRecord: ChannelAccessRecord,
    actor: {
      actorType: AuditLog["actorType"];
      actorId: string;
    },
    action: "grant" | "revoke",
    correlationId: string,
    operation: () => Promise<TResult>
  ): Promise<{
    outcome: "success" | "failure";
    failureKind: TelegramFailureKind | null;
    record: ChannelAccessRecord;
    result: TResult;
  } | {
    outcome: "failure";
    failureKind: TelegramFailureKind;
    record: ChannelAccessRecord;
    result: null;
  }> {
    const maxAttempts = 3;
    let attempts = 0;
    let currentRecord = accessRecord;

    while (attempts < maxAttempts) {
      attempts += 1;
      currentRecord = await this.channelAccessRepository.upsert({
        ...currentRecord,
        executionStatus:
          attempts === 1 ? "attempting" : "retrying",
        executionAttempts: attempts,
        lastExecutionAttemptAt: isoNow(this.clock()),
        lastCorrelationId: correlationId,
        updatedAt: isoNow(this.clock())
      });

      await this.appendAuditLog({
        actorType: actor.actorType,
        actorId: actor.actorId,
        action: `channel_access.${action}_execution_attempted`,
        entityType: "channel_access",
        entityId: currentRecord.id,
        metadata: {
          userId: accessRecord.userId,
          correlationId,
          attempt: attempts
        }
      });

      try {
        const result = await operation();
        currentRecord = await this.channelAccessRepository.upsert({
          ...currentRecord,
          executionStatus: "succeeded",
          lastError: null,
          lastErrorCode: null,
          lastFailureKind: null,
          lastExecutionOutcomeAt: isoNow(this.clock()),
          updatedAt: isoNow(this.clock())
        });
        await this.appendAuditLog({
          actorType: actor.actorType,
          actorId: actor.actorId,
          action: `channel_access.${action}_executed`,
          entityType: "channel_access",
          entityId: currentRecord.id,
          metadata: {
            userId: accessRecord.userId,
            correlationId,
            attempt: attempts
          }
        });

        return {
          outcome: "success",
          failureKind: null,
          record: currentRecord,
          result
        };
      } catch (error) {
        const failure = this.normalizeTelegramExecutionError(error);
        const finalAttempt = attempts >= maxAttempts || failure.failureKind === "non_retryable";
        const executionStatus: TelegramExecutionStatus =
          failure.failureKind === "retryable" && !finalAttempt
            ? "retrying"
            : failure.failureKind === "retryable"
              ? "failed_retryable"
              : "failed_non_retryable";

        currentRecord = await this.channelAccessRepository.upsert({
          ...currentRecord,
          executionStatus,
          lastError: failure.message,
          lastErrorCode: failure.code,
          lastFailureKind: failure.failureKind,
          lastExecutionOutcomeAt: finalAttempt ? isoNow(this.clock()) : currentRecord.lastExecutionOutcomeAt ?? null,
          updatedAt: isoNow(this.clock())
        });

        await this.appendAuditLog({
          actorType: actor.actorType,
          actorId: actor.actorId,
          action: `channel_access.${action}_failed`,
          entityType: "channel_access",
          entityId: currentRecord.id,
          metadata: {
            userId: accessRecord.userId,
            correlationId,
            attempt: attempts,
            failureKind: failure.failureKind,
            errorCode: failure.code,
            retryable: failure.failureKind === "retryable"
          }
        });

        if (finalAttempt) {
          return {
            outcome: "failure",
            failureKind: failure.failureKind,
            record: currentRecord,
            result: null
          };
        }

        await this.sleep(this.backoffMs(attempts));
      }
    }

    return {
      outcome: "failure",
      failureKind: "retryable",
      record: currentRecord,
      result: null
    };
  }

  private normalizeTelegramExecutionError(error: unknown): {
    code: string;
    message: string;
    failureKind: TelegramFailureKind;
  } {
    if (error instanceof TelegramProviderError) {
      return {
        code: error.code,
        message: error.message,
        failureKind: error.failureKind
      };
    }

    if (error instanceof DomainError) {
      return {
        code: error.code,
        message: error.message,
        failureKind: "non_retryable"
      };
    }

    return {
      code: "telegram_provider_error",
      message: error instanceof Error ? error.message : "Unexpected Telegram execution failure.",
      failureKind: "retryable"
    };
  }

  private backoffMs(attempt: number): number {
    if (this.env.NODE_ENV === "test") {
      return 0;
    }

    return 250 * 2 ** (attempt - 1);
  }

  private async appendAuditLog(input: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    await this.auditLogRepository.append({
      id: createId("audit"),
      createdAt: isoNow(this.clock()),
      ...input
    });
  }
}
