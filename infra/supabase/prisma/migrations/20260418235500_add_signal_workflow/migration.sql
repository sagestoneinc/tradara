-- CreateEnum
CREATE TYPE "SignalStatus" AS ENUM ('draft', 'ai_scored', 'pending_review', 'approved', 'edited', 'rejected', 'published', 'canceled');

-- CreateEnum
CREATE TYPE "SignalSourceType" AS ENUM ('tradingview', 'manual', 'ai_assisted');

-- CreateEnum
CREATE TYPE "TradeDirection" AS ENUM ('long', 'short', 'neutral');

-- CreateEnum
CREATE TYPE "RiskLabel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "MarketInsightStatus" AS ENUM ('draft', 'pending_review', 'approved', 'published', 'rejected', 'canceled');

-- CreateTable
CREATE TABLE "SignalInput" (
    "id" TEXT NOT NULL,
    "sourceType" "SignalSourceType" NOT NULL,
    "sourceProvider" "WebhookProvider",
    "sourceEventId" TEXT,
    "symbol" TEXT NOT NULL,
    "timeframe" TEXT,
    "direction" "TradeDirection",
    "entryZoneLow" DECIMAL(65,30),
    "entryZoneHigh" DECIMAL(65,30),
    "stopLoss" DECIMAL(65,30),
    "takeProfit1" DECIMAL(65,30),
    "takeProfit2" DECIMAL(65,30),
    "takeProfit3" DECIMAL(65,30),
    "marketPrice" DECIMAL(65,30),
    "trendAlignment" INTEGER,
    "structureQuality" INTEGER,
    "volatilityQuality" INTEGER,
    "liquidityQuality" INTEGER,
    "riskRewardQuality" INTEGER,
    "conflictPenalty" INTEGER,
    "note" TEXT,
    "strategyName" TEXT,
    "detectedAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignalInput_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Signal" (
    "id" TEXT NOT NULL,
    "signalInputId" TEXT NOT NULL,
    "status" "SignalStatus" NOT NULL,
    "sourceType" "SignalSourceType" NOT NULL,
    "confidenceScore" INTEGER,
    "setupQualityScore" INTEGER,
    "riskLabel" "RiskLabel",
    "invalidationSummary" TEXT,
    "setupRationale" TEXT,
    "marketContext" TEXT,
    "warnings" JSONB NOT NULL,
    "confidenceBreakdown" JSONB NOT NULL,
    "telegramDraft" TEXT,
    "expertReviewNotes" TEXT,
    "editedTelegramDraft" TEXT,
    "publishedTelegramText" TEXT,
    "publishedTelegramChatId" TEXT,
    "publishedTelegramMessageId" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Signal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignalReview" (
    "id" TEXT NOT NULL,
    "signalId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "resultingStatus" "SignalStatus" NOT NULL,
    "notes" TEXT,
    "editedTelegramDraft" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SignalReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MarketInsight" (
    "id" TEXT NOT NULL,
    "status" "MarketInsightStatus" NOT NULL,
    "symbol" TEXT NOT NULL,
    "timeframe" TEXT,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "telegramDraft" TEXT,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "rejectedBy" TEXT,
    "rejectedAt" TIMESTAMP(3),
    "canceledAt" TIMESTAMP(3),
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SignalInput_sourceType_createdAt_idx" ON "SignalInput"("sourceType", "createdAt");

-- CreateIndex
CREATE INDEX "SignalInput_sourceProvider_sourceEventId_idx" ON "SignalInput"("sourceProvider", "sourceEventId");

-- CreateIndex
CREATE UNIQUE INDEX "Signal_signalInputId_key" ON "Signal"("signalInputId");

-- CreateIndex
CREATE INDEX "Signal_status_createdAt_idx" ON "Signal"("status", "createdAt");

-- CreateIndex
CREATE INDEX "SignalReview_signalId_createdAt_idx" ON "SignalReview"("signalId", "createdAt");

-- CreateIndex
CREATE INDEX "SignalReview_reviewerId_createdAt_idx" ON "SignalReview"("reviewerId", "createdAt");

-- CreateIndex
CREATE INDEX "MarketInsight_status_createdAt_idx" ON "MarketInsight"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "Signal" ADD CONSTRAINT "Signal_signalInputId_fkey" FOREIGN KEY ("signalInputId") REFERENCES "SignalInput"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SignalReview" ADD CONSTRAINT "SignalReview_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "Signal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
