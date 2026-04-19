DO $$
BEGIN
  CREATE TYPE "TelegramLinkState" AS ENUM ('unlinked', 'pending', 'linked');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "clerkUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "displayName" TEXT,
  ADD COLUMN IF NOT EXISTS "telegramLinkState" "TelegramLinkState" NOT NULL DEFAULT 'unlinked',
  ADD COLUMN IF NOT EXISTS "telegramLinkedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lastLoginAt" TIMESTAMP(3);

UPDATE "User"
SET
  "telegramLinkState" = 'linked',
  "telegramLinkedAt" = COALESCE("telegramLinkedAt", "updatedAt")
WHERE "telegramUserId" IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS "User_clerkUserId_key" ON "User"("clerkUserId");

CREATE TABLE IF NOT EXISTS "TelegramLinkSession" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "clerkUserId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "consumedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "TelegramLinkSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "TelegramLinkSession_tokenHash_key"
  ON "TelegramLinkSession"("tokenHash");

CREATE INDEX IF NOT EXISTS "TelegramLinkSession_userId_createdAt_idx"
  ON "TelegramLinkSession"("userId", "createdAt");

DO $$
BEGIN
  ALTER TABLE "TelegramLinkSession"
    ADD CONSTRAINT "TelegramLinkSession_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;
