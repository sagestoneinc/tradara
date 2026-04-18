import type { BotApiEnv } from "@tradara/shared-config";
import { accessPolicy } from "@tradara/shared-config";
import type {
  AuditLog,
  ChannelAccessRecord,
  SubscriptionSnapshot,
  TelegramInvite,
  WebhookEvent
} from "@tradara/shared-types";
import { addHours, isoNow } from "@tradara/shared-utils";

import { StubTelegramBotAdapter } from "./bot/telegram-bot.adapter";
import {
  InMemoryAuditLogRepository,
  InMemoryChannelAccessRepository,
  InMemorySubscriptionRepository,
  InMemoryTelegramInviteRepository,
  InMemoryWebhookEventRepository,
  type RepositorySeed
} from "./repositories/in-memory-repositories";
import { ChannelAccessReconciliationJob } from "./jobs/channel-access-reconciliation.job";
import { ChannelAccessController } from "./modules/channel-access/channel-access.controller";
import { ChannelAccessService } from "./modules/channel-access/channel-access.service";
import { EntitlementService } from "./modules/channel-access/entitlement.service";
import { ChannelAccessReconciliationService } from "./modules/channel-access/reconciliation.service";
import {
  StubTelegramAccessAdapter,
  type TelegramAccessAdapter
} from "./modules/channel-access/telegram-access.adapter";
import { TelegramWebhookController } from "./modules/webhooks/telegram/telegram-webhook.controller";
import { TelegramWebhookService } from "./modules/webhooks/telegram/telegram-webhook.service";

export interface AppContainer {
  env: BotApiEnv;
  controllers: {
    channelAccess: ChannelAccessController;
    telegramWebhook: TelegramWebhookController;
  };
  jobs: {
    channelAccessReconciliation: ChannelAccessReconciliationJob;
  };
}

export function createContainer(
  env: BotApiEnv,
  seed?: RepositorySeed,
  telegramAccessAdapter: TelegramAccessAdapter = new StubTelegramAccessAdapter()
): AppContainer {
  const now = new Date("2026-04-18T12:00:00.000Z");
  const repositorySeed = seed ?? createDefaultSeed(env, now);

  const subscriptionRepository = new InMemorySubscriptionRepository(repositorySeed.subscriptions);
  const channelAccessRepository = new InMemoryChannelAccessRepository(repositorySeed.channelAccess);
  const inviteRepository = new InMemoryTelegramInviteRepository(repositorySeed.telegramInvites);
  const auditLogRepository = new InMemoryAuditLogRepository(repositorySeed.auditLogs);
  const webhookEventRepository = new InMemoryWebhookEventRepository(repositorySeed.webhookEvents);
  const clock = () => new Date(now.getTime());

  const entitlementService = new EntitlementService(clock);
  const channelAccessService = new ChannelAccessService(
    env,
    subscriptionRepository,
    channelAccessRepository,
    inviteRepository,
    auditLogRepository,
    entitlementService,
    telegramAccessAdapter,
    clock
  );
  const reconciliationService = new ChannelAccessReconciliationService(
    subscriptionRepository,
    channelAccessRepository,
    entitlementService,
    channelAccessService
  );
  const reconciliationJob = new ChannelAccessReconciliationJob(reconciliationService);
  const telegramBot = new StubTelegramBotAdapter();
  const telegramWebhookService = new TelegramWebhookService(
    env,
    webhookEventRepository,
    channelAccessService,
    telegramBot,
    clock
  );

  return {
    env,
    controllers: {
      channelAccess: new ChannelAccessController(channelAccessService, reconciliationJob),
      telegramWebhook: new TelegramWebhookController(telegramWebhookService)
    },
    jobs: {
      channelAccessReconciliation: reconciliationJob
    }
  };
}

function createDefaultSeed(env: BotApiEnv, now: Date): RepositorySeed {
  const subscriptions: SubscriptionSnapshot[] = [
    {
      id: "sub_active_001",
      userId: "user_active",
      planId: "tradara-pro-monthly",
      status: "active",
      currentPeriodEndsAt: addHours(now, 24 * 14).toISOString(),
      gracePeriodEndsAt: null
    },
    {
      id: "sub_grace_001",
      userId: "user_grace",
      planId: "tradara-pro-quarterly",
      status: "grace_period",
      currentPeriodEndsAt: addHours(now, -12).toISOString(),
      gracePeriodEndsAt: addHours(now, accessPolicy.defaultGracePeriodHours).toISOString()
    },
    {
      id: "sub_expired_001",
      userId: "user_expired",
      planId: "tradara-pro-monthly",
      status: "expired",
      currentPeriodEndsAt: addHours(now, -48).toISOString(),
      gracePeriodEndsAt: null
    }
  ];

  const channelAccess: ChannelAccessRecord[] = [
    {
      id: "access_active_001",
      userId: "user_active",
      subscriptionId: "sub_active_001",
      channelId: env.TELEGRAM_PREMIUM_CHANNEL_ID,
      telegramUserId: "10001",
      status: "granted",
      desiredState: "grant",
      inviteId: null,
      lastSyncedAt: isoNow(now),
      lastError: null,
      updatedAt: isoNow(now)
    },
    {
      id: "access_expired_001",
      userId: "user_expired",
      subscriptionId: "sub_expired_001",
      channelId: env.TELEGRAM_PREMIUM_CHANNEL_ID,
      telegramUserId: "10003",
      status: "granted",
      desiredState: "grant",
      inviteId: null,
      lastSyncedAt: isoNow(now),
      lastError: null,
      updatedAt: isoNow(now)
    }
  ];

  return {
    subscriptions,
    channelAccess,
    telegramInvites: [] satisfies TelegramInvite[],
    auditLogs: [] satisfies AuditLog[],
    webhookEvents: [] satisfies WebhookEvent[]
  };
}
