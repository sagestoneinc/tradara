import type {
  AuditLog,
  ChannelAccessRecord,
  SubscriptionSnapshot,
  TelegramInvite,
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

