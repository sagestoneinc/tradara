import type {
  AuditLog,
  ChannelAccessRecord,
  ProviderName,
  SubscriptionPlanId,
  SubscriptionSnapshot,
  SubscriptionStatus,
  TelegramFailureKind,
  TelegramLinkSession,
  TelegramInvite,
  TelegramInviteStatus,
  TelegramLinkState,
  TelegramExecutionStatus,
  UserSnapshot,
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
} from "@prisma/client";

import type {
  AuditLogRepository,
  ChannelAccessRepository,
  SubscriptionRepository,
  TelegramLinkSessionRepository,
  TelegramInviteRepository,
  UserRepository,
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

  throw new Error(`Unsupported Prisma subscription plan ID: ${String(value)}`);
}

function toPrismaSubscriptionStatus(value: SubscriptionStatus): PrismaSubscriptionStatus {
  return value;
}

function toPrismaProviderName(value: ProviderName): PrismaWebhookProvider {
  return value as unknown as PrismaWebhookProvider;
}

function fromPrismaProviderName(value: PrismaWebhookProvider | null): ProviderName | undefined {
  return (value as ProviderName | null) ?? undefined;
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

function deriveDisplayName(input: {
  displayName?: string | null;
  email?: string | null;
  clerkUserId?: string | null;
  id: string;
}): string {
  return input.displayName ?? input.email ?? input.clerkUserId ?? input.id;
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
  providerName?: PrismaWebhookProvider | null;
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
    providerName:
      record.providerName !== undefined ? fromPrismaProviderName(record.providerName) : undefined,
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
  inviteId?: string | null;
  lastSyncedAt: Date | null;
  lastError: string | null;
  lastErrorCode?: string | null;
  lastFailureKind?: PrismaTelegramFailureKind | null;
  executionStatus?: PrismaTelegramExecutionStatus | null;
  executionAttempts?: number | null;
  lastExecutionAttemptAt?: Date | null;
  lastExecutionOutcomeAt?: Date | null;
  lastCorrelationId?: string | null;
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
    inviteId: record.inviteId ?? null,
    lastSyncedAt: formatDate(record.lastSyncedAt),
    lastError: record.lastError,
    lastErrorCode: record.lastErrorCode ?? null,
    lastFailureKind: record.lastFailureKind ?? null,
    executionStatus: record.executionStatus ?? null,
    executionAttempts: record.executionAttempts ?? undefined,
    lastExecutionAttemptAt: formatDate(record.lastExecutionAttemptAt ?? null),
    lastExecutionOutcomeAt: formatDate(record.lastExecutionOutcomeAt ?? null),
    lastCorrelationId: record.lastCorrelationId ?? null,
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

function mapUser(record: {
  id: string;
  email: string | null;
  clerkUserId?: string | null;
  displayName?: string | null;
  telegramUserId: string | null;
  telegramLinkState?: TelegramLinkState;
  telegramLinkedAt?: Date | null;
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}): UserSnapshot {
  return {
    id: record.id,
    displayName: deriveDisplayName(record),
    email: record.email,
    clerkUserId: record.clerkUserId,
    telegramHandle: null,
    telegramUserId: record.telegramUserId,
    telegramLinkState: record.telegramLinkState ?? (record.telegramUserId ? "linked" : "unlinked"),
    telegramLinkedAt: formatDate(record.telegramLinkedAt ?? null),
    lastLoginAt: formatDate(record.lastLoginAt ?? null),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString()
  };
}

function mapTelegramLinkSession(record: {
  id: string;
  userId: string;
  clerkUserId: string;
  tokenHash: string;
  expiresAt: Date;
  consumedAt: Date | null;
  createdAt: Date;
}): TelegramLinkSession {
  return {
    id: record.id,
    userId: record.userId,
    clerkUserId: record.clerkUserId,
    tokenHash: record.tokenHash,
    expiresAt: record.expiresAt.toISOString(),
    consumedAt: formatDate(record.consumedAt),
    createdAt: record.createdAt.toISOString()
  };
}


function resolveAuditUserId(metadata: Record<string, unknown>): string | null {
  const userId = metadata.userId;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

function isUniqueViolation(error: unknown): boolean {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2002";
  }

  return false;
}

export class PrismaSubscriptionRepository implements SubscriptionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByUserId(userId: string): Promise<SubscriptionSnapshot | null> {
    const record = await this.prisma.subscription.findFirst({
      where: { userId },
      select: {
        id: true,
        userId: true,
        planId: true,
        status: true,
        providerCustomerId: true,
        providerSubscriptionId: true,
        currentPeriodEndsAt: true,
        gracePeriodEndsAt: true,
        canceledAt: true
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapSubscription(record) : null;
  }

  async listAll(): Promise<SubscriptionSnapshot[]> {
    const records = await this.prisma.subscription.findMany({
      select: {
        id: true,
        userId: true,
        planId: true,
        status: true,
        providerCustomerId: true,
        providerSubscriptionId: true,
        currentPeriodEndsAt: true,
        gracePeriodEndsAt: true,
        canceledAt: true
      },
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
      select: {
        id: true,
        userId: true,
        subscriptionId: true,
        channelId: true,
        telegramUserId: true,
        status: true,
        desiredState: true,
        lastSyncedAt: true,
        lastError: true,
        updatedAt: true
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapChannelAccess(record) : null;
  }

  async findByTelegramUserId(telegramUserId: string): Promise<ChannelAccessRecord | null> {
    const record = await this.prisma.channelAccess.findFirst({
      where: { telegramUserId },
      select: {
        id: true,
        userId: true,
        subscriptionId: true,
        channelId: true,
        telegramUserId: true,
        status: true,
        desiredState: true,
        lastSyncedAt: true,
        lastError: true,
        updatedAt: true
      },
      orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }]
    });

    return record ? mapChannelAccess(record) : null;
  }

  async listAll(): Promise<ChannelAccessRecord[]> {
    const records = await this.prisma.channelAccess.findMany({
      select: {
        id: true,
        userId: true,
        subscriptionId: true,
        channelId: true,
        telegramUserId: true,
        status: true,
        desiredState: true,
        lastSyncedAt: true,
        lastError: true,
        updatedAt: true
      },
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
        lastSyncedAt: parseDate(record.lastSyncedAt),
        lastError: record.lastError ?? null,
        updatedAt: new Date(record.updatedAt)
      },
      update: {
        userId: record.userId,
        subscriptionId: record.subscriptionId ?? null,
        channelId: record.channelId,
        telegramUserId: record.telegramUserId ?? null,
        status: toPrismaChannelAccessStatus(record.status),
        desiredState: toPrismaDesiredState(record.desiredState),
        lastSyncedAt: parseDate(record.lastSyncedAt),
        lastError: record.lastError ?? null,
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
        metadata: log.metadata as Prisma.InputJsonValue,
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
    const where: Prisma.WebhookEventWhereUniqueInput = {
      provider_providerEventId: {
        provider: toPrismaProviderName(event.provider),
        providerEventId: event.providerEventId
      }
    };

    try {
      const created = await this.prisma.webhookEvent.create({
        data: {
          id: event.id,
          provider: toPrismaProviderName(event.provider),
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

export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string): Promise<UserSnapshot | null> {
    const record = await this.prisma.$queryRaw<
      Array<{
        id: string;
        email: string | null;
        clerkUserId: string | null;
        displayName: string | null;
        telegramUserId: string | null;
        telegramLinkState: TelegramLinkState;
        telegramLinkedAt: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`SELECT "id", "email", "clerkUserId", "displayName", "telegramUserId", "telegramLinkState", "telegramLinkedAt", "lastLoginAt", "createdAt", "updatedAt"
      FROM "User"
      WHERE "id" = ${id}
      LIMIT 1`;
    return record[0] ? mapUser(record[0]) : null;
  }

  async findByClerkUserId(clerkUserId: string): Promise<UserSnapshot | null> {
    const record = await this.prisma.$queryRaw<
      Array<{
        id: string;
        email: string | null;
        clerkUserId: string | null;
        displayName: string | null;
        telegramUserId: string | null;
        telegramLinkState: TelegramLinkState;
        telegramLinkedAt: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`SELECT "id", "email", "clerkUserId", "displayName", "telegramUserId", "telegramLinkState", "telegramLinkedAt", "lastLoginAt", "createdAt", "updatedAt"
      FROM "User"
      WHERE "clerkUserId" = ${clerkUserId}
      LIMIT 1`;
    return record[0] ? mapUser(record[0]) : null;
  }

  async findByEmail(email: string): Promise<UserSnapshot | null> {
    const normalizedEmail = email.toLowerCase();
    const record = await this.prisma.$queryRaw<
      Array<{
        id: string;
        email: string | null;
        clerkUserId: string | null;
        displayName: string | null;
        telegramUserId: string | null;
        telegramLinkState: TelegramLinkState;
        telegramLinkedAt: Date | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>
    >`SELECT "id", "email", "clerkUserId", "displayName", "telegramUserId", "telegramLinkState", "telegramLinkedAt", "lastLoginAt", "createdAt", "updatedAt"
      FROM "User"
      WHERE LOWER("email") = ${normalizedEmail}
      LIMIT 1`;
    return record[0] ? mapUser(record[0]) : null;
  }

  async save(user: UserSnapshot): Promise<void> {
    await this.prisma.$executeRaw`
      INSERT INTO "User" (
        "id",
        "email",
        "clerkUserId",
        "displayName",
        "telegramUserId",
        "telegramLinkState",
        "telegramLinkedAt",
        "lastLoginAt",
        "createdAt",
        "updatedAt"
      )
      VALUES (
        ${user.id},
        ${user.email?.toLowerCase() ?? null},
        ${user.clerkUserId ?? null},
        ${user.displayName},
        ${user.telegramUserId ?? null},
        ${user.telegramLinkState ?? (user.telegramUserId ? "linked" : "unlinked")},
        ${parseDate(user.telegramLinkedAt)},
        ${parseDate(user.lastLoginAt)},
        ${new Date(user.createdAt)},
        ${new Date(user.updatedAt)}
      )
      ON CONFLICT ("id")
      DO UPDATE SET
        "email" = EXCLUDED."email",
        "clerkUserId" = EXCLUDED."clerkUserId",
        "displayName" = EXCLUDED."displayName",
        "telegramUserId" = EXCLUDED."telegramUserId",
        "telegramLinkState" = EXCLUDED."telegramLinkState",
        "telegramLinkedAt" = EXCLUDED."telegramLinkedAt",
        "lastLoginAt" = EXCLUDED."lastLoginAt",
        "updatedAt" = EXCLUDED."updatedAt"`;
  }
}

export class PrismaTelegramLinkSessionRepository implements TelegramLinkSessionRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByTokenHash(tokenHash: string): Promise<TelegramLinkSession | null> {
    const record = await this.prisma.$queryRaw<
      Array<{
        id: string;
        userId: string;
        clerkUserId: string;
        tokenHash: string;
        expiresAt: Date;
        consumedAt: Date | null;
        createdAt: Date;
      }>
    >`SELECT "id", "userId", "clerkUserId", "tokenHash", "expiresAt", "consumedAt", "createdAt"
      FROM "TelegramLinkSession"
      WHERE "tokenHash" = ${tokenHash}
      LIMIT 1`;
    return record[0] ? mapTelegramLinkSession(record[0]) : null;
  }

  async save(session: TelegramLinkSession): Promise<void> {
    await ensureUser(this.prisma, {
      id: session.userId
    });

    await this.prisma.$executeRaw`
      INSERT INTO "TelegramLinkSession" (
        "id",
        "userId",
        "clerkUserId",
        "tokenHash",
        "expiresAt",
        "consumedAt",
        "createdAt"
      )
      VALUES (
        ${session.id},
        ${session.userId},
        ${session.clerkUserId},
        ${session.tokenHash},
        ${new Date(session.expiresAt)},
        ${parseDate(session.consumedAt)},
        ${new Date(session.createdAt)}
      )
      ON CONFLICT ("tokenHash")
      DO UPDATE SET
        "userId" = EXCLUDED."userId",
        "clerkUserId" = EXCLUDED."clerkUserId",
        "expiresAt" = EXCLUDED."expiresAt",
        "consumedAt" = EXCLUDED."consumedAt"`;
  }
}
