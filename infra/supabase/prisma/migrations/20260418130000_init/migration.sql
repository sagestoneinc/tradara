CREATE TYPE "SubscriptionPlanId" AS ENUM (
  'tradara_pro_monthly',
  'tradara_pro_quarterly',
  'tradara_pro_annual'
);

CREATE TYPE "SubscriptionStatus" AS ENUM (
  'trialing',
  'active',
  'past_due',
  'grace_period',
  'canceled',
  'expired'
);

CREATE TYPE "ChannelAccessStatus" AS ENUM (
  'pending_grant',
  'granted',
  'pending_revoke',
  'revoked',
  'error'
);

CREATE TYPE "AccessDesiredState" AS ENUM ('grant', 'revoke');
CREATE TYPE "TelegramInviteStatus" AS ENUM ('pending', 'issued', 'consumed', 'expired', 'failed');
CREATE TYPE "WebhookProvider" AS ENUM ('telegram', 'paymongo', 'tradingview');
CREATE TYPE "AuditActorType" AS ENUM ('system', 'admin', 'job', 'webhook');

CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE,
  "telegramUserId" TEXT UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Subscription" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "planId" "SubscriptionPlanId" NOT NULL,
  "status" "SubscriptionStatus" NOT NULL,
  "providerCustomerId" TEXT,
  "providerSubscriptionId" TEXT,
  "currentPeriodEndsAt" TIMESTAMP(3) NOT NULL,
  "gracePeriodEndsAt" TIMESTAMP(3),
  "canceledAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ChannelAccess" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "subscriptionId" TEXT,
  "channelId" TEXT NOT NULL,
  "telegramUserId" TEXT,
  "status" "ChannelAccessStatus" NOT NULL,
  "desiredState" "AccessDesiredState" NOT NULL,
  "lastSyncedAt" TIMESTAMP(3),
  "lastError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ChannelAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "ChannelAccess_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "Subscription" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE "TelegramInvite" (
  "id" TEXT PRIMARY KEY,
  "accessId" TEXT,
  "userId" TEXT NOT NULL,
  "channelId" TEXT NOT NULL,
  "inviteUrl" TEXT,
  "status" "TelegramInviteStatus" NOT NULL,
  "expiresAt" TIMESTAMP(3),
  "note" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelegramInvite_accessId_fkey" FOREIGN KEY ("accessId") REFERENCES "ChannelAccess" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "TelegramInvite_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "WebhookEvent" (
  "id" TEXT PRIMARY KEY,
  "provider" "WebhookProvider" NOT NULL,
  "providerEventId" TEXT NOT NULL,
  "payloadHash" TEXT NOT NULL,
  "signatureValid" BOOLEAN NOT NULL,
  "processedAt" TIMESTAMP(3),
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT,
  "actorType" "AuditActorType" NOT NULL,
  "actorId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "entityType" TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "metadata" JSONB NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "WebhookEvent_provider_providerEventId_key"
  ON "WebhookEvent" ("provider", "providerEventId");

