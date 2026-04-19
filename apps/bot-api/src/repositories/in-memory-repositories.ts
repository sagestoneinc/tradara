import type {
  AuditLog,
  ChannelAccessRecord,
  MarketInsightSnapshot,
  SignalInputSnapshot,
  SignalReviewSnapshot,
  SignalSnapshot,
  SubscriptionSnapshot,
  TelegramInvite,
  WebhookEvent
} from "@tradara/shared-types";

import type {
  AuditLogRepository,
  ChannelAccessRepository,
  MarketInsightRepository,
  SignalRepository,
  SignalInputRepository,
  SignalReviewRepository,
  SubscriptionRepository,
  TelegramInviteRepository,
  WebhookEventRepository
} from "./types";

export interface RepositorySeed {
  subscriptions?: SubscriptionSnapshot[];
  signalInputs?: SignalInputSnapshot[];
  signals?: SignalSnapshot[];
  signalReviews?: SignalReviewSnapshot[];
  marketInsights?: MarketInsightSnapshot[];
  channelAccess?: ChannelAccessRecord[];
  telegramInvites?: TelegramInvite[];
  auditLogs?: AuditLog[];
  webhookEvents?: WebhookEvent[];
}

export class InMemorySubscriptionRepository implements SubscriptionRepository {
  private readonly items = new Map<string, SubscriptionSnapshot>();

  constructor(seed: SubscriptionSnapshot[] = []) {
    seed.forEach((item) => {
      this.items.set(item.userId, item);
    });
  }

  async findByUserId(userId: string): Promise<SubscriptionSnapshot | null> {
    return this.items.get(userId) ?? null;
  }

  async listAll(): Promise<SubscriptionSnapshot[]> {
    return [...this.items.values()];
  }

  async save(subscription: SubscriptionSnapshot): Promise<void> {
    this.items.set(subscription.userId, subscription);
  }
}

export class InMemoryChannelAccessRepository implements ChannelAccessRepository {
  private readonly items = new Map<string, ChannelAccessRecord>();

  constructor(seed: ChannelAccessRecord[] = []) {
    seed.forEach((item) => {
      this.items.set(item.userId, item);
    });
  }

  async findByUserId(userId: string): Promise<ChannelAccessRecord | null> {
    return this.items.get(userId) ?? null;
  }

  async findByTelegramUserId(telegramUserId: string): Promise<ChannelAccessRecord | null> {
    return (
      [...this.items.values()].find((item) => item.telegramUserId === telegramUserId) ?? null
    );
  }

  async listAll(): Promise<ChannelAccessRecord[]> {
    return [...this.items.values()];
  }

  async upsert(record: ChannelAccessRecord): Promise<ChannelAccessRecord> {
    this.items.set(record.userId, record);
    return record;
  }
}

export class InMemorySignalRepository implements SignalRepository {
  private readonly items = new Map<string, SignalSnapshot>();

  constructor(seed: SignalSnapshot[] = []) {
    seed.forEach((item) => {
      this.items.set(item.id, item);
    });
  }

  async findById(id: string): Promise<SignalSnapshot | null> {
    return this.items.get(id) ?? null;
  }

  async listAll(): Promise<SignalSnapshot[]> {
    return [...this.items.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async save(signal: SignalSnapshot): Promise<void> {
    this.items.set(signal.id, signal);
  }
}

export class InMemorySignalInputRepository implements SignalInputRepository {
  private readonly items = new Map<string, SignalInputSnapshot>();

  constructor(seed: SignalInputSnapshot[] = []) {
    seed.forEach((item) => this.items.set(item.id, item));
  }

  async findById(id: string): Promise<SignalInputSnapshot | null> {
    return this.items.get(id) ?? null;
  }

  async listAll(): Promise<SignalInputSnapshot[]> {
    return [...this.items.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async save(input: SignalInputSnapshot): Promise<void> {
    this.items.set(input.id, input);
  }
}

export class InMemorySignalReviewRepository implements SignalReviewRepository {
  private readonly items: SignalReviewSnapshot[];

  constructor(seed: SignalReviewSnapshot[] = []) {
    this.items = [...seed];
  }

  async listBySignalId(signalId: string): Promise<SignalReviewSnapshot[]> {
    return this.items
      .filter((item) => item.signalId === signalId)
      .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async save(review: SignalReviewSnapshot): Promise<void> {
    this.items.unshift(review);
  }
}

export class InMemoryMarketInsightRepository implements MarketInsightRepository {
  private readonly items = new Map<string, MarketInsightSnapshot>();

  constructor(seed: MarketInsightSnapshot[] = []) {
    seed.forEach((item) => this.items.set(item.id, item));
  }

  async findById(id: string): Promise<MarketInsightSnapshot | null> {
    return this.items.get(id) ?? null;
  }

  async listAll(): Promise<MarketInsightSnapshot[]> {
    return [...this.items.values()].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  async save(insight: MarketInsightSnapshot): Promise<void> {
    this.items.set(insight.id, insight);
  }
}

export class InMemoryTelegramInviteRepository implements TelegramInviteRepository {
  private readonly items: TelegramInvite[] = [];

  constructor(seed: TelegramInvite[] = []) {
    this.items = [...seed];
  }

  async save(invite: TelegramInvite): Promise<void> {
    const existingIndex = this.items.findIndex((item) => item.id === invite.id);
    if (existingIndex >= 0) {
      this.items.splice(existingIndex, 1, invite);
      return;
    }

    this.items.push(invite);
  }

  async listAll(): Promise<TelegramInvite[]> {
    return [...this.items];
  }
}

export class InMemoryAuditLogRepository implements AuditLogRepository {
  private readonly items: AuditLog[] = [];

  constructor(seed: AuditLog[] = []) {
    this.items = [...seed];
  }

  async append(log: AuditLog): Promise<void> {
    this.items.unshift(log);
  }

  async listRecent(limit = 25): Promise<AuditLog[]> {
    return this.items.slice(0, limit);
  }
}

export class InMemoryWebhookEventRepository implements WebhookEventRepository {
  private readonly items = new Map<string, WebhookEvent>();

  constructor(seed: WebhookEvent[] = []) {
    seed.forEach((item) => {
      this.items.set(`${item.provider}:${item.providerEventId}`, item);
    });
  }

  async recordIncoming(event: WebhookEvent): Promise<{ duplicate: boolean; event: WebhookEvent }> {
    const key = `${event.provider}:${event.providerEventId}`;
    const existing = this.items.get(key);

    if (existing) {
      return {
        duplicate: true,
        event: existing
      };
    }

    this.items.set(key, event);
    return { duplicate: false, event };
  }

  async markProcessed(id: string, processedAt: string): Promise<void> {
    for (const [key, event] of this.items.entries()) {
      if (event.id === id) {
        this.items.set(key, {
          ...event,
          processedAt
        });
      }
    }
  }

  async listAll(): Promise<WebhookEvent[]> {
    return [...this.items.values()];
  }
}
