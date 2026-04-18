import type {
  AuditLog,
  ChannelAccessRecord,
  ProviderName,
  SubscriptionPlanId,
  SubscriptionSnapshot,
  SubscriptionStatus,
  TelegramFailureKind,
  TelegramInvite,
  TelegramInviteStatus,
  TelegramExecutionStatus,
  WebhookEvent
} from "@tradara/shared-types";
import {
  Prisma,
  PrismaClient,
  type AccessDesiredState as PrismaAccessDesiredState,
  type AuditActorType as PrismaAuditActorType,
  type ChannelAccessStatus as PrismaChannelAccessStatus,
  type SubscriptionPlanId as PrismaSubscriptionPlanId,
  type SubscriptionStatus as PrismaSubscriptionStatus,
  type TelegramFailureKind as PrismaTelegramFailureKind,
  type TelegramExecutionStatus as PrismaTelegramExecutionStatus,
  type TelegramInviteStatus as PrismaTelegramInviteStatus,
  type WebhookProvider as PrismaWebhookProvider
} from "../../../../generated/prisma";

import type {
  AuditLogRepository,
  ChannelAccessRepository,
  SubscriptionRepository,
  TelegramInviteRepository,
  WebhookEventRepository
} from "./types";

function parseDate(value: string | null | undefined): Date | null {
  return value ? new Date(value) : null;
}

function formatDate(value: Date | null | undefined): string | null {
  return value ? value.toISOString() : null;
}

function toPrismaPlanId(value: SubscriptionPlanId): PrismaSubscriptionPlanId {
  switch (value) {
    case "tradara-pro-monthly":
      return "tradara_pro_monthly";
    case "tradara-pro-quarterly":
      return "tradara_pro_quarterly";
    case "tradara-pro-annual":
      return "tradara_pro_annual";
  }
}

function fromPrismaPlanId(value: PrismaSubscriptionPlanId): SubscriptionPlanId {
  switch (value) {
    case "tradara_pro_monthly":
      return "tradara-pro-monthly";
    case "tradara_pro_quarterly":
      return "tradara-pro-quarterly";
    case "tradara_pro_annual":
      return "tradara-pro-annual";
  }
}

function toPrismaSubscriptionStatus(value: SubscriptionStatus): PrismaSubscriptionStatus {
  return value;
}

function toPrismaProviderName(value: ProviderName): PrismaWebhookProvider {
  return value;
}

function fromPrismaProviderName(value: PrismaWebhookProvider | null): ProviderName | undefined {
  return value ?? undefined;
}

function toPrismaChannelAccessStatus(
  value: ChannelAccessRecord["status"]
): PrismaChannelAccessStatus {
  return value;
}

function toPrismaDesiredState(
  value: ChannelAccessRecord["desiredState"]
): PrismaAccessDesiredState {
  return value;
}

function toPrismaInviteStatus(value: TelegramInviteStatus): PrismaTelegramInviteStatus {
  return value;
}

function toPrismaAuditActorType(value: AuditLog["actorType"]): PrismaAuditActorType {
  return value;
}

function toPrismaExecutionStatus(
  value: TelegramExecutionStatus | null | undefined
): PrismaTelegramExecutionStatus | null | undefined {
  return value ?? null;
}

function toPrismaFailureKind(
  value: TelegramFailureKind | null | undefined
): PrismaTelegramFailureKind | null | undefined {
  return value ?? null;
}

async function ensureUser(
  prisma: PrismaClient,
  input: {
    id: string;
    email?: string | null;
    telegramUserId?: string | null;
  }
): Promise<void> {
  await prisma.user.upsert({
    where: {
      id: input.id
    },
    create: {
      id: input.id,
      email: input.email ?? null,
      telegramUserId: input.telegramUserId ?? null
    },
    update: {
      ...(input.email !== undefined ? { email: input.email } : {}),
      ...(input.telegramUserId !== undefined ? { telegramUserId: input.telegramUserId } : {})
    }
  });
}

function mapSubscription(record: {
  id: string;
  userId: string;
  planId: PrismaSubscriptionPlanId;
  status: PrismaSubscriptionStatus;
  providerName: PrismaWebhookProvider | null;
  providerCustomerId: string | null;
  providerSubscriptionId: string | null;
  currentPeriodEndsAt: Date;
  gracePeriodEndsAt: Date | null;
  canceledAt: Date | null;
}): SubscriptionSnapshot {
  return {
    id: record.id,
    userId: record.userId,
    planId: fromPrismaPlanId(record.planId),
    status: record.status,
    providerName: fromPrismaProviderName(record.providerName),
    providerCustomerId: record.providerCustomerId,
    providerSubscriptionId: record.providerSubscriptionId,
    currentPeriodEndsAt: record.currentPeriodEndsAt.toISOString(),
    gracePeriodEndsAt: formatDate(record.gracePeriodEndsAt),
    canceledAt: formatDate(record.canceledAt)
  };
}

function mapChannelAccess(record: {
  id: string;
  userId: string;
  subscriptionId: string | null;
  channelId: string;
  telegramUserId: string | null;
  status: PrismaChannelAccessStatus;
  desiredState: PrismaAccessDesiredState;
  inviteId: string | null;
  lastSyncedAt: Date | null;
  lastError: string | null;
  lastErrorCode: string | null;
  lastFailureKind: PrismaTelegramFailureKind | null;
  executionStatus: PrismaTelegramExecutionStatus | null;
  executionAttempts: number | null;
  lastExecutionAttemptAt: Date | null;
  lastExecutionOutcomeAt: Date | null;
  lastCorrelationId: string | null;
  updatedAt: Date;
}): ChannelAccessRecord {
  return {
    id: record.id,
    userId: record.userId,
    subscriptionId: record.subscriptionId,
    channelId: record.channelId,
    telegramUserId: record.telegramUserId,
    status: record.status,
    desiredState: record.desiredState,
    inviteId: record.inviteId,
    lastSyncedAt: formatDate(record.lastSyncedAt),
    lastError: record.lastError,
    lastErrorCode: record.lastErrorCode,
    lastFailureKind: record.lastFailureKind,
    executionStatus: record.executionStatus,
    executionAttempts: record.executionAttempts ?? undefined,
    lastExecutionAttemptAt: formatDate(record.lastExecutionAttemptAt),
    lastExecutionOutcomeAt: formatDate(record.lastExecutionOutcomeAt),
    lastCorrelationId: record.lastCorrelationId,
    updatedAt: record.updatedAt.toISOString()
  };
}

function mapInvite(record: {
  id: string;
  userId: string;
  channelId: string;
  inviteUrl: string | null;
  status: PrismaTelegramInviteStatus;
  expiresAt: Date | null;
  note: string;
}): TelegramInvite {
  return {
    id: record.id,
    userId: record.userId,
    channelId: record.channelId,
    inviteUrl: record.inviteUrl,
    status: record.status,
    expiresAt: formatDate(record.expiresAt),
    note: record.note
  };
}

function mapAuditLog(record: {
  id: string;
  actorType: PrismaAuditActorType;
  actorId: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata: Prisma.JsonValue;
  createdAt: Date;
}): AuditLog {
  return {
    id: record.id,
    actorType: record.actorType,
    actorId: record.actorId,
    action: record.action,
    entityType: record.entityType,
    entityId: record.entityId,
    metadata:
      record.metadata && typeof record.metadata === "object" && !Array.isArray(record.metadata)
        ? (record.metadata as Record<string, unknown>)
        : {},
    createdAt: record.createdAt.toISOString()
  };
}

function mapWebhookEvent(record: {
  id: string;
  provider: PrismaWebhookProvider;
  providerEventId: string;
  payloadHash: string;
  signatureValid: boolean;
  processedAt: Date | null;
  receivedAt: Date;
}): WebhookEvent {
  return {
    id: record.id,
    provider: record.provider,
    providerEventId: record.providerEventId,
    payloadHash: record.payloadHash,
    signatureValid: record.signatureValid,
    processedAt: formatDate(record.processedAt),
    receivedAt: record.receivedAt.toISOString()
  };
}

function resolveAuditUserId(metadata: Record<string, unknown>): string | null {
  const userId = metadata.userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

function isUniqueViolation(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<SubscriptionSnapshot | null> {
    const record = await this.prisma.subscription.findFirst({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapSubscription(record) : null;
  }

  async listAll(): Promise<SubscriptionSnapshot[]> {
    const records = await this.prisma.subscription.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapSubscription(record));
  }

  async save(subscription: SubscriptionSnapshot): Promise<void> {
    await ensureUser(this.prisma, { id: subscription.userId });
    await this.prisma.subscription.upsert({
      where: { id: subscription.id },
      create: {
        id: subscription.id,
        userId: subscription.userId,
        planId: toPrismaPlanId(subscription.planId),
        status: toPrismaSubscriptionStatus(subscription.status),
        providerName: subscription.providerName
          ? toPrismaProviderName(subscription.providerName)
          : null,
        providerCustomerId: subscription.providerCustomerId ?? null,
        providerSubscriptionId: subscription.providerSubscriptionId ?? null,
        currentPeriodEndsAt: new Date(subscription.currentPeriodEndsAt),
        gracePeriodEndsAt: parseDate(subscription.gracePeriodEndsAt),
        canceledAt: parseDate(subscription.canceledAt)
      },
      update: {
        userId: subscription.userId,
        planId: toPrismaPlanId(subscription.planId),
        status: toPrismaSubscriptionStatus(subscription.status),
        providerName: subscription.providerName
          ? toPrismaProviderName(subscription.providerName)
          : null,
        providerCustomerId: subscription.providerCustomerId ?? null,
        providerSubscriptionId: subscription.providerSubscriptionId ?? null,
        currentPeriodEndsAt: new Date(subscription.currentPeriodEndsAt),
        gracePeriodEndsAt: parseDate(subscription.gracePeriodEndsAt),
        canceledAt: parseDate(subscription.canceledAt)
      }
    });
  }
}

export class PrismaChannelAccessRepository implements ChannelAccessRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<ChannelAccessRecord | null> {
    const record = await this.prisma.channelAccess.findFirst({
      where: { userId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapChannelAccess(record) : null;
  }

  async findByTelegramUserId(telegramUserId: string): Promise<ChannelAccessRecord | null> {
    const record = await this.prisma.channelAccess.findFirst({
      where: { telegramUserId },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapChannelAccess(record) : null;
  }

  async listAll(): Promise<ChannelAccessRecord[]> {
    const records = await this.prisma.channelAccess.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapChannelAccess(record));
  }

  async upsert(record: ChannelAccessRecord): Promise<ChannelAccessRecord> {
    await ensureUser(this.prisma, {
      id: record.userId,
      telegramUserId: record.telegramUserId ?? undefined
    });

    const persisted = await this.prisma.channelAccess.upsert({
      where: { id: record.id },
      create: {
        id: record.id,
        userId: record.userId,
        subscriptionId: record.subscriptionId ?? null,
        channelId: record.channelId,
        telegramUserId: record.telegramUserId ?? null,
        status: toPrismaChannelAccessStatus(record.status),
        desiredState: toPrismaDesiredState(record.desiredState),
        inviteId: record.inviteId ?? null,
        lastSyncedAt: parseDate(record.lastSyncedAt),
        lastError: record.lastError ?? null,
        lastErrorCode: record.lastErrorCode ?? null,
        lastFailureKind: toPrismaFailureKind(record.lastFailureKind),
        executionStatus: toPrismaExecutionStatus(record.executionStatus),
        executionAttempts: record.executionAttempts ?? null,
        lastExecutionAttemptAt: parseDate(record.lastExecutionAttemptAt),
        lastExecutionOutcomeAt: parseDate(record.lastExecutionOutcomeAt),
        lastCorrelationId: record.lastCorrelationId ?? null,
        updatedAt: new Date(record.updatedAt)
      },
      update: {
        userId: record.userId,
        subscriptionId: record.subscriptionId ?? null,
        channelId: record.channelId,
        telegramUserId: record.telegramUserId ?? null,
        status: toPrismaChannelAccessStatus(record.status),
        desiredState: toPrismaDesiredState(record.desiredState),
        inviteId: record.inviteId ?? null,
        lastSyncedAt: parseDate(record.lastSyncedAt),
        lastError: record.lastError ?? null,
        lastErrorCode: record.lastErrorCode ?? null,
        lastFailureKind: toPrismaFailureKind(record.lastFailureKind),
        executionStatus: toPrismaExecutionStatus(record.executionStatus),
        executionAttempts: record.executionAttempts ?? null,
        lastExecutionAttemptAt: parseDate(record.lastExecutionAttemptAt),
        lastExecutionOutcomeAt: parseDate(record.lastExecutionOutcomeAt),
        lastCorrelationId: record.lastCorrelationId ?? null,
        updatedAt: new Date(record.updatedAt)
      }
    });

    return mapChannelAccess(persisted);
  }
}

export class PrismaTelegramInviteRepository implements TelegramInviteRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async save(invite: TelegramInvite): Promise<void> {
    await ensureUser(this.prisma, { id: invite.userId });
    await this.prisma.telegramInvite.upsert({
      where: { id: invite.id },
      create: {
        id: invite.id,
        userId: invite.userId,
        channelId: invite.channelId,
        inviteUrl: invite.inviteUrl ?? null,
        status: toPrismaInviteStatus(invite.status),
        expiresAt: parseDate(invite.expiresAt),
        note: invite.note
      },
      update: {
        userId: invite.userId,
        channelId: invite.channelId,
        inviteUrl: invite.inviteUrl ?? null,
        status: toPrismaInviteStatus(invite.status),
        expiresAt: parseDate(invite.expiresAt),
        note: invite.note
      }
    });
  }

  async listAll(): Promise<TelegramInvite[]> {
    const records = await this.prisma.telegramInvite.findMany({
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return records.map((record) => mapInvite(record));
  }
}

export class PrismaAuditLogRepository implements AuditLogRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async append(log: AuditLog): Promise<void> {
    const userId = resolveAuditUserId(log.metadata);
    if (userId) {
      await ensureUser(this.prisma, { id: userId });
    }

    await this.prisma.auditLog.create({
      data: {
        id: log.id,
        userId,
        actorType: toPrismaAuditActorType(log.actorType),
        actorId: log.actorId,
        action: log.action,
        entityType: log.entityType,
        entityId: log.entityId,
        metadata: log.metadata,
        createdAt: new Date(log.createdAt)
      }
    });
  }

  async listRecent(limit = 25): Promise<AuditLog[]> {
    const records = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: "desc" },
      take: limit
    });

    return records.map((record) => mapAuditLog(record));
  }
}

export class PrismaWebhookEventRepository implements WebhookEventRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async recordIncoming(event: WebhookEvent): Promise<{ duplicate: boolean; event: WebhookEvent }> {
    const where = {
      provider_providerEventId: {
        provider: event.provider,
        providerEventId: event.providerEventId
      }
    } as const;

    try {
      const created = await this.prisma.webhookEvent.create({
        data: {
          id: event.id,
          provider: event.provider,
          providerEventId: event.providerEventId,
          payloadHash: event.payloadHash,
          signatureValid: event.signatureValid,
          processedAt: parseDate(event.processedAt),
          receivedAt: new Date(event.receivedAt)
        }
      });

      return {
        duplicate: false,
        event: mapWebhookEvent(created)
      };
    } catch (error) {
      if (!isUniqueViolation(error)) {
        throw error;
      }

      const existing = await this.prisma.webhookEvent.findUnique({ where });
      if (!existing) {
        throw error;
      }

      return {
        duplicate: true,
        event: mapWebhookEvent(existing)
      };
    }
  }

  async markProcessed(id: string, processedAt: string): Promise<void> {
    await this.prisma.webhookEvent.update({
      where: { id },
      data: {
        processedAt: new Date(processedAt)
      }
    });
  }

  async listAll(): Promise<WebhookEvent[]> {
    const records = await this.prisma.webhookEvent.findMany({
      orderBy: { receivedAt: "desc" }
    });

    return records.map((record) => mapWebhookEvent(record));
  }
}
