import type {
  AuditLog,
  ChannelAccessRecord,
  MarketInsightSnapshot,
  SignalInputSnapshot,
  SignalReviewSnapshot,
  SignalSnapshot,
  SubscriptionSnapshot,
  TelegramLinkSession,
  TelegramInvite,
  UserSnapshot,
  WebhookEvent
} from "@tradara/shared-types";

export interface SubscriptionRepository {
  findByUserId(userId: string): Promise<SubscriptionSnapshot | null>;
  listAll(): Promise<SubscriptionSnapshot[]>;
  save(subscription: SubscriptionSnapshot): Promise<void>;
}

export interface ChannelAccessRepository {
  findByUserId(userId: string): Promise<ChannelAccessRecord | null>;
  findByTelegramUserId(telegramUserId: string): Promise<ChannelAccessRecord | null>;
  listAll(): Promise<ChannelAccessRecord[]>;
  upsert(record: ChannelAccessRecord): Promise<ChannelAccessRecord>;
}

export interface TelegramInviteRepository {
  save(invite: TelegramInvite): Promise<void>;
  listAll(): Promise<TelegramInvite[]>;
}

export interface AuditLogRepository {
  append(log: AuditLog): Promise<void>;
  listRecent(limit?: number): Promise<AuditLog[]>;
}

export interface WebhookEventRepository {
  recordIncoming(event: WebhookEvent): Promise<{ duplicate: boolean; event: WebhookEvent }>;
  markProcessed(id: string, processedAt: string): Promise<void>;
  listAll(): Promise<WebhookEvent[]>;
}

export interface UserRepository {
  findById(id: string): Promise<UserSnapshot | null>;
  findByClerkUserId(clerkUserId: string): Promise<UserSnapshot | null>;
  findByEmail(email: string): Promise<UserSnapshot | null>;
  save(user: UserSnapshot): Promise<void>;
}

export interface TelegramLinkSessionRepository {
  findByTokenHash(tokenHash: string): Promise<TelegramLinkSession | null>;
  save(session: TelegramLinkSession): Promise<void>;
}

export interface SignalRepository {
  findById(id: string): Promise<SignalSnapshot | null>;
  findBySignalInputId(signalInputId: string): Promise<SignalSnapshot | null>;
  listAll(): Promise<SignalSnapshot[]>;
  save(signal: SignalSnapshot): Promise<void>;
}

export interface SignalInputRepository {
  findById(id: string): Promise<SignalInputSnapshot | null>;
  findBySourceEventId(
    sourceType: SignalInputSnapshot["sourceType"],
    sourceEventId: string
  ): Promise<SignalInputSnapshot | null>;
  listAll(): Promise<SignalInputSnapshot[]>;
  save(input: SignalInputSnapshot): Promise<void>;
}

export interface SignalReviewRepository {
  listBySignalId(signalId: string): Promise<SignalReviewSnapshot[]>;
  save(review: SignalReviewSnapshot): Promise<void>;
}

export interface MarketInsightRepository {
  findById(id: string): Promise<MarketInsightSnapshot | null>;
  listAll(): Promise<MarketInsightSnapshot[]>;
  save(insight: MarketInsightSnapshot): Promise<void>;
}
