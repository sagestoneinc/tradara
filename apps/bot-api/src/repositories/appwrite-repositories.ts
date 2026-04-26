import { AppwriteException, Databases, ID, Query } from "node-appwrite";
import type {
  AuditLog,
  ChannelAccessRecord,
  SubscriptionSnapshot,
  TelegramInvite,
  TelegramLinkSession,
  UserSnapshot,
  WebhookEvent
} from "@tradara/shared-types";

import type {
  AuditLogRepository,
  ChannelAccessRepository,
  SubscriptionRepository,
  TelegramInviteRepository,
  TelegramLinkSessionRepository,
  UserRepository,
  WebhookEventRepository
} from "./types";

const COLLECTIONS = {
  users: "users",
  subscriptions: "subscriptions",
  channel_access: "channel_access",
  telegram_invites: "telegram_invites",
  telegram_link_sessions: "telegram_link_sessions",
  audit_logs: "audit_logs",
  webhook_events: "webhook_events"
} as const;

function isConflict(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 409;
}

function isNotFound(error: unknown): boolean {
  return error instanceof AppwriteException && error.code === 404;
}

function docToSubscription(doc: Record<string, unknown>): SubscriptionSnapshot {
  return {
    id: doc.$id as string,
    userId: doc.userId as string,
    planId: doc.planId as SubscriptionSnapshot["planId"],
    status: doc.status as SubscriptionSnapshot["status"],
    providerName: (doc.providerName as SubscriptionSnapshot["providerName"]) ?? undefined,
    providerCustomerId: (doc.providerCustomerId as string | null) ?? null,
    providerSubscriptionId: (doc.providerSubscriptionId as string | null) ?? null,
    currentPeriodEndsAt: doc.currentPeriodEndsAt as string,
    gracePeriodEndsAt: (doc.gracePeriodEndsAt as string | null) ?? null,
    canceledAt: (doc.canceledAt as string | null) ?? undefined
  };
}

function subscriptionToDoc(sub: SubscriptionSnapshot): Record<string, unknown> {
  return {
    userId: sub.userId,
    planId: sub.planId,
    status: sub.status,
    providerName: sub.providerName ?? null,
    providerCustomerId: sub.providerCustomerId ?? null,
    providerSubscriptionId: sub.providerSubscriptionId ?? null,
    currentPeriodEndsAt: sub.currentPeriodEndsAt,
    gracePeriodEndsAt: sub.gracePeriodEndsAt ?? null,
    canceledAt: sub.canceledAt ?? null
  };
}

export class AppwriteSubscriptionRepository implements SubscriptionRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findByUserId(userId: string): Promise<SubscriptionSnapshot | null> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.subscriptions, [
      Query.equal("userId", userId),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToSubscription(result.documents[0] as Record<string, unknown>);
  }

  async listAll(): Promise<SubscriptionSnapshot[]> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.subscriptions);
    return result.documents.map((doc) => docToSubscription(doc as Record<string, unknown>));
  }

  async save(subscription: SubscriptionSnapshot): Promise<void> {
    const data = subscriptionToDoc(subscription);
    try {
      await this.db.createDocument(
        this.databaseId,
        COLLECTIONS.subscriptions,
        subscription.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          COLLECTIONS.subscriptions,
          subscription.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}

function docToChannelAccess(doc: Record<string, unknown>): ChannelAccessRecord {
  return {
    id: doc.$id as string,
    userId: doc.userId as string,
    subscriptionId: (doc.subscriptionId as string | null) ?? null,
    channelId: doc.channelId as string,
    telegramUserId: (doc.telegramUserId as string | null) ?? null,
    status: doc.status as ChannelAccessRecord["status"],
    desiredState: doc.desiredState as ChannelAccessRecord["desiredState"],
    inviteId: (doc.inviteId as string | null) ?? null,
    lastSyncedAt: (doc.lastSyncedAt as string | null) ?? null,
    lastError: (doc.lastError as string | null) ?? null,
    lastErrorCode: (doc.lastErrorCode as string | null) ?? null,
    lastFailureKind: (doc.lastFailureKind as ChannelAccessRecord["lastFailureKind"]) ?? null,
    executionStatus: (doc.executionStatus as ChannelAccessRecord["executionStatus"]) ?? null,
    executionAttempts: (doc.executionAttempts as number | null | undefined) ?? undefined,
    lastExecutionAttemptAt: (doc.lastExecutionAttemptAt as string | null | undefined) ?? null,
    lastExecutionOutcomeAt: (doc.lastExecutionOutcomeAt as string | null | undefined) ?? null,
    lastCorrelationId: (doc.lastCorrelationId as string | null) ?? null,
    updatedAt: doc.updatedAt as string
  };
}

function channelAccessToDoc(record: ChannelAccessRecord): Record<string, unknown> {
  return {
    userId: record.userId,
    subscriptionId: record.subscriptionId ?? null,
    channelId: record.channelId,
    telegramUserId: record.telegramUserId ?? null,
    status: record.status,
    desiredState: record.desiredState,
    inviteId: record.inviteId ?? null,
    lastSyncedAt: record.lastSyncedAt ?? null,
    lastError: record.lastError ?? null,
    lastErrorCode: record.lastErrorCode ?? null,
    lastFailureKind: record.lastFailureKind ?? null,
    executionStatus: record.executionStatus ?? null,
    executionAttempts: record.executionAttempts ?? null,
    lastExecutionAttemptAt: record.lastExecutionAttemptAt ?? null,
    lastExecutionOutcomeAt: record.lastExecutionOutcomeAt ?? null,
    lastCorrelationId: record.lastCorrelationId ?? null,
    updatedAt: record.updatedAt
  };
}

export class AppwriteChannelAccessRepository implements ChannelAccessRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findByUserId(userId: string): Promise<ChannelAccessRecord | null> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.channel_access, [
      Query.equal("userId", userId),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToChannelAccess(result.documents[0] as Record<string, unknown>);
  }

  async findByTelegramUserId(telegramUserId: string): Promise<ChannelAccessRecord | null> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.channel_access, [
      Query.equal("telegramUserId", telegramUserId),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToChannelAccess(result.documents[0] as Record<string, unknown>);
  }

  async listAll(): Promise<ChannelAccessRecord[]> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.channel_access);
    return result.documents.map((doc) => docToChannelAccess(doc as Record<string, unknown>));
  }

  async upsert(record: ChannelAccessRecord): Promise<ChannelAccessRecord> {
    const data = channelAccessToDoc(record);
    try {
      await this.db.createDocument(this.databaseId, COLLECTIONS.channel_access, record.id, data);
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          COLLECTIONS.channel_access,
          record.id,
          data
        );
        return record;
      }
      throw error;
    }
    return record;
  }
}

function docToTelegramInvite(doc: Record<string, unknown>): TelegramInvite {
  return {
    id: doc.$id as string,
    userId: doc.userId as string,
    channelId: doc.channelId as string,
    inviteUrl: (doc.inviteUrl as string | null) ?? null,
    status: doc.status as TelegramInvite["status"],
    expiresAt: (doc.expiresAt as string | null) ?? null,
    note: (doc.note as string) ?? ""
  };
}

export class AppwriteTelegramInviteRepository implements TelegramInviteRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async save(invite: TelegramInvite): Promise<void> {
    const data: Record<string, unknown> = {
      userId: invite.userId,
      channelId: invite.channelId,
      inviteUrl: invite.inviteUrl ?? null,
      status: invite.status,
      expiresAt: invite.expiresAt ?? null,
      note: invite.note
    };
    try {
      await this.db.createDocument(this.databaseId, COLLECTIONS.telegram_invites, invite.id, data);
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          COLLECTIONS.telegram_invites,
          invite.id,
          data
        );
        return;
      }
      throw error;
    }
  }

  async listAll(): Promise<TelegramInvite[]> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.telegram_invites);
    return result.documents.map((doc) => docToTelegramInvite(doc as Record<string, unknown>));
  }
}

function docToAuditLog(doc: Record<string, unknown>): AuditLog {
  return {
    id: doc.$id as string,
    actorType: doc.actorType as AuditLog["actorType"],
    actorId: doc.actorId as string,
    action: doc.action as string,
    entityType: doc.entityType as string,
    entityId: doc.entityId as string,
    metadata:
      typeof doc.metadata === "string"
        ? (JSON.parse(doc.metadata) as Record<string, unknown>)
        : ((doc.metadata as Record<string, unknown>) ?? {}),
    createdAt: (doc.$createdAt as string) ?? (doc.createdAt as string)
  };
}

export class AppwriteAuditLogRepository implements AuditLogRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async append(log: AuditLog): Promise<void> {
    await this.db.createDocument(this.databaseId, COLLECTIONS.audit_logs, log.id, {
      actorType: log.actorType,
      actorId: log.actorId,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      metadata: JSON.stringify(log.metadata),
      createdAt: log.createdAt
    });
  }

  async listRecent(limit?: number): Promise<AuditLog[]> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.audit_logs, [
      Query.orderDesc("$createdAt"),
      Query.limit(limit ?? 100)
    ]);

    return result.documents.map((doc) => docToAuditLog(doc as Record<string, unknown>));
  }
}

function docToWebhookEvent(doc: Record<string, unknown>): WebhookEvent {
  return {
    id: doc.$id as string,
    provider: doc.provider as WebhookEvent["provider"],
    providerEventId: doc.providerEventId as string,
    payloadHash: doc.payloadHash as string,
    signatureValid: doc.signatureValid as boolean,
    processedAt: (doc.processedAt as string | null) ?? null,
    receivedAt: (doc.receivedAt as string) ?? (doc.$createdAt as string)
  };
}

export class AppwriteWebhookEventRepository implements WebhookEventRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async recordIncoming(
    event: WebhookEvent
  ): Promise<{ duplicate: boolean; event: WebhookEvent }> {
    try {
      await this.db.createDocument(this.databaseId, COLLECTIONS.webhook_events, event.id, {
        provider: event.provider,
        providerEventId: event.providerEventId,
        payloadHash: event.payloadHash,
        signatureValid: event.signatureValid,
        processedAt: event.processedAt ?? null,
        receivedAt: event.receivedAt
      });
      return { duplicate: false, event };
    } catch (error) {
      if (isConflict(error)) {
        return { duplicate: true, event };
      }
      throw error;
    }
  }

  async markProcessed(id: string, processedAt: string): Promise<void> {
    await this.db.updateDocument(this.databaseId, COLLECTIONS.webhook_events, id, {
      processedAt
    });
  }

  async listAll(): Promise<WebhookEvent[]> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.webhook_events);
    return result.documents.map((doc) => docToWebhookEvent(doc as Record<string, unknown>));
  }
}

function docToUser(doc: Record<string, unknown>): UserSnapshot {
  return {
    id: doc.$id as string,
    displayName: (doc.displayName as string) || (doc.email as string) || (doc.$id as string),
    email: (doc.email as string | null) ?? null,
    clerkUserId: (doc.clerkUserId as string | null) ?? null,
    telegramHandle: (doc.telegramHandle as string | null) ?? null,
    telegramUserId: (doc.telegramUserId as string | null) ?? null,
    telegramLinkState: (doc.telegramLinkState as UserSnapshot["telegramLinkState"]) ?? "unlinked",
    telegramLinkedAt: (doc.telegramLinkedAt as string | null) ?? null,
    lastLoginAt: (doc.lastLoginAt as string | null) ?? null,
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string),
    updatedAt: (doc.updatedAt as string) ?? (doc.$updatedAt as string)
  };
}

function userToDoc(user: UserSnapshot): Record<string, unknown> {
  return {
    displayName: user.displayName,
    email: user.email ?? null,
    clerkUserId: user.clerkUserId ?? null,
    telegramHandle: user.telegramHandle ?? null,
    telegramUserId: user.telegramUserId ?? null,
    telegramLinkState: user.telegramLinkState ?? "unlinked",
    telegramLinkedAt: user.telegramLinkedAt ?? null,
    lastLoginAt: user.lastLoginAt ?? null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

export class AppwriteUserRepository implements UserRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findById(id: string): Promise<UserSnapshot | null> {
    try {
      const doc = await this.db.getDocument(this.databaseId, COLLECTIONS.users, id);
      return docToUser(doc as unknown as Record<string, unknown>);
    } catch (error) {
      if (isNotFound(error)) return null;
      throw error;
    }
  }

  async findByClerkUserId(clerkUserId: string): Promise<UserSnapshot | null> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.users, [
      Query.equal("clerkUserId", clerkUserId),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToUser(result.documents[0] as unknown as Record<string, unknown>);
  }

  async findByEmail(email: string): Promise<UserSnapshot | null> {
    const result = await this.db.listDocuments(this.databaseId, COLLECTIONS.users, [
      Query.equal("email", email),
      Query.limit(1)
    ]);

    if (result.documents.length === 0) return null;
    return docToUser(result.documents[0] as unknown as Record<string, unknown>);
  }

  async save(user: UserSnapshot): Promise<void> {
    const data = userToDoc(user);
    try {
      await this.db.createDocument(this.databaseId, COLLECTIONS.users, user.id, data);
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(this.databaseId, COLLECTIONS.users, user.id, data);
        return;
      }
      throw error;
    }
  }
}

function docToTelegramLinkSession(doc: Record<string, unknown>): TelegramLinkSession {
  return {
    id: doc.$id as string,
    userId: doc.userId as string,
    clerkUserId: doc.clerkUserId as string,
    tokenHash: doc.tokenHash as string,
    expiresAt: doc.expiresAt as string,
    consumedAt: (doc.consumedAt as string | null) ?? null,
    createdAt: (doc.createdAt as string) ?? (doc.$createdAt as string)
  };
}

export class AppwriteTelegramLinkSessionRepository implements TelegramLinkSessionRepository {
  constructor(
    private readonly db: Databases,
    private readonly databaseId: string
  ) {}

  async findByTokenHash(tokenHash: string): Promise<TelegramLinkSession | null> {
    const result = await this.db.listDocuments(
      this.databaseId,
      COLLECTIONS.telegram_link_sessions,
      [Query.equal("tokenHash", tokenHash), Query.limit(1)]
    );

    if (result.documents.length === 0) return null;
    return docToTelegramLinkSession(result.documents[0] as unknown as Record<string, unknown>);
  }

  async save(session: TelegramLinkSession): Promise<void> {
    const data: Record<string, unknown> = {
      userId: session.userId,
      clerkUserId: session.clerkUserId,
      tokenHash: session.tokenHash,
      expiresAt: session.expiresAt,
      consumedAt: session.consumedAt ?? null,
      createdAt: session.createdAt
    };
    try {
      await this.db.createDocument(
        this.databaseId,
        COLLECTIONS.telegram_link_sessions,
        session.id,
        data
      );
    } catch (error) {
      if (isConflict(error)) {
        await this.db.updateDocument(
          this.databaseId,
          COLLECTIONS.telegram_link_sessions,
          session.id,
          data
        );
        return;
      }
      throw error;
    }
  }
}
