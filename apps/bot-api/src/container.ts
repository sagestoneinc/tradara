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
import type { PrismaClient } from "@prisma/client";

import { TelegramBotApiAdapter } from "./bot/telegram-bot.adapter";
import type { TelegramBotLike } from "./bot/types/bot";
import { getPrismaClient } from "./lib/prisma";
import {
  InMemoryAuditLogRepository,
  InMemoryChannelAccessRepository,
  InMemorySubscriptionRepository,
  InMemoryTelegramInviteRepository,
  InMemoryWebhookEventRepository,
  type RepositorySeed
} from "./repositories/in-memory-repositories";
import {
  PrismaAuditLogRepository,
  PrismaChannelAccessRepository,
  PrismaSubscriptionRepository,
  PrismaTelegramInviteRepository,
  PrismaWebhookEventRepository
} from "./repositories/prisma-repositories";
import { ChannelAccessReconciliationJob } from "./jobs/channel-access-reconciliation.job";
import { AdminController } from "./modules/admin/admin.controller";
import { AdminService } from "./modules/admin/admin.service";
import { BillingController } from "./modules/billing/billing.controller";
import { BillingService } from "./modules/billing/billing.service";
import { PayPalAdapter } from "./modules/billing/providers/paypal-adapter";
import { XenditAdapter } from "./modules/billing/providers/xendit-adapter";
import { PayMongoAdapter } from "./modules/billing/providers/paymongo-adapter";
import { ChannelAccessController } from "./modules/channel-access/channel-access.controller";
import { ChannelAccessService } from "./modules/channel-access/channel-access.service";
import { EntitlementService } from "./modules/channel-access/entitlement.service";
import { ChannelAccessReconciliationService } from "./modules/channel-access/reconciliation.service";
import {
  TelegramBotApiAccessAdapter,
  type TelegramAccessAdapter
} from "./modules/channel-access/telegram-access.adapter";
import { TelegramWebhookController } from "./modules/webhooks/telegram/telegram-webhook.controller";
import { TelegramWebhookService } from "./modules/webhooks/telegram/telegram-webhook.service";

export interface AppContainer {
  env: BotApiEnv;
  controllers: {
    admin: AdminController;
    billing: BillingController;
    channelAccess: ChannelAccessController;
    telegramWebhook: TelegramWebhookController;
  };
  jobs: {
    channelAccessReconciliation: ChannelAccessReconciliationJob;
  };
}

export interface CreateContainerOptions {
  persistence?: "memory" | "prisma";
  prisma?: PrismaClient;
  seed?: RepositorySeed;
  telegramAccessAdapter?: TelegramAccessAdapter;
  telegramBot?: TelegramBotLike;
}

export function createContainer(
  env: BotApiEnv,
  options: CreateContainerOptions = {}
): AppContainer {
  const persistence = options.persistence ?? "prisma";
  const telegramAccessAdapter =
    options.telegramAccessAdapter ?? new TelegramBotApiAccessAdapter(env);
  const telegramBot = options.telegramBot ?? new TelegramBotApiAdapter(env);
  const now = new Date("2026-04-18T12:00:00.000Z");
  const clock = persistence === "memory" ? () => new Date(now.getTime()) : () => new Date();

  const {
    subscriptionRepository,
    channelAccessRepository,
    inviteRepository,
    auditLogRepository,
    webhookEventRepository
  } =
    persistence === "memory"
      ? createInMemoryRepositories(options.seed ?? createDefaultSeed(env, now))
      : createPrismaRepositories(options.prisma ?? getPrismaClient(env.DATABASE_URL));

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
  const telegramWebhookService = new TelegramWebhookService(
    env,
    webhookEventRepository,
    channelAccessService,
    telegramBot,
    clock
  );

  // Create payment provider adapters
  const paymentProviders = new Map();
  paymentProviders.set("paypal", new PayPalAdapter(env));
  paymentProviders.set("xendit", new XenditAdapter(env));
  paymentProviders.set("paymongo", new PayMongoAdapter(env));

  const billingService = new BillingService(
    env,
    subscriptionRepository,
    webhookEventRepository,
    auditLogRepository,
    paymentProviders,
    clock
  );
  const adminService = new AdminService(channelAccessService, webhookEventRepository, clock);

  return {
    env,
    controllers: {
      admin: new AdminController(adminService),
      billing: new BillingController(billingService),
      channelAccess: new ChannelAccessController(channelAccessService, reconciliationJob),
      telegramWebhook: new TelegramWebhookController(telegramWebhookService)
    },
    jobs: {
      channelAccessReconciliation: reconciliationJob
    }
  };
}

function createInMemoryRepositories(seed: RepositorySeed) {
  return {
    subscriptionRepository: new InMemorySubscriptionRepository(seed.subscriptions),
    channelAccessRepository: new InMemoryChannelAccessRepository(seed.channelAccess),
    inviteRepository: new InMemoryTelegramInviteRepository(seed.telegramInvites),
    auditLogRepository: new InMemoryAuditLogRepository(seed.auditLogs),
    webhookEventRepository: new InMemoryWebhookEventRepository(seed.webhookEvents)
  };
}

function createPrismaRepositories(prisma: PrismaClient) {
  return {
    subscriptionRepository: new PrismaSubscriptionRepository(prisma),
    channelAccessRepository: new PrismaChannelAccessRepository(prisma),
    inviteRepository: new PrismaTelegramInviteRepository(prisma),
    auditLogRepository: new PrismaAuditLogRepository(prisma),
    webhookEventRepository: new PrismaWebhookEventRepository(prisma)
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
