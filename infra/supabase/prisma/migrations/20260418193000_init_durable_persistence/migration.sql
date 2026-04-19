-- Delta migration on top of 20260418130000_init.
-- The initial schema already created the core tables/enums; this migration should
-- only add the durability and delivery-observability fields introduced later.

DO $$
BEGIN
  CREATE TYPE "TelegramExecutionStatus" AS ENUM (
    'idle',
    'attempting',
    'retrying',
    'succeeded',
    'failed_retryable',
    'failed_non_retryable'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE "TelegramFailureKind" AS ENUM ('retryable', 'non_retryable');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TYPE "WebhookProvider" ADD VALUE IF NOT EXISTS 'paypal';
ALTER TYPE "WebhookProvider" ADD VALUE IF NOT EXISTS 'xendit';

ALTER TABLE "Subscription"
  ADD COLUMN IF NOT EXISTS "providerName" "WebhookProvider";

ALTER TABLE "ChannelAccess"
  ADD COLUMN IF NOT EXISTS "inviteId" TEXT,
  ADD COLUMN IF NOT EXISTS "lastErrorCode" TEXT,
  ADD COLUMN IF NOT EXISTS "lastFailureKind" "TelegramFailureKind",
  ADD COLUMN IF NOT EXISTS "executionStatus" "TelegramExecutionStatus",
  ADD COLUMN IF NOT EXISTS "executionAttempts" INTEGER,
  ADD COLUMN IF NOT EXISTS "lastExecutionAttemptAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastExecutionOutcomeAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastCorrelationId" TEXT;
