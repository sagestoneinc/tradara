-- Additive platform foundations for learning, practice, trade ideas, journaling, and onboarding.

CREATE TYPE "ExperienceLevel" AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE "UserMode" AS ENUM ('lite', 'pro');
CREATE TYPE "LearningProgressStatus" AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE "TradeIdeaSetupType" AS ENUM ('breakout', 'pullback', 'range', 'reversal', 'continuation', 'other');
CREATE TYPE "BeginnerSuitability" AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE "AnalystReviewStatus" AS ENUM ('draft', 'pending_review', 'approved', 'rejected', 'published', 'archived');
CREATE TYPE "TradeIdeaOutcomeStatus" AS ENUM ('open', 'hit_target', 'invalidated', 'canceled', 'timed_out');
CREATE TYPE "TradeLifecycleStatus" AS ENUM ('open', 'closed', 'canceled');
CREATE TYPE "UserEmotion" AS ENUM ('calm', 'confident', 'anxious', 'fearful', 'greedy', 'frustrated', 'uncertain');

CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "experienceLevel" "ExperienceLevel",
    "riskProfile" JSONB NOT NULL,
    "mode" "UserMode" NOT NULL DEFAULT 'lite',
    "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "LearningPath" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "level" "ExperienceLevel" NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LearningPath_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lesson" (
    "id" TEXT NOT NULL,
    "pathId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "level" "ExperienceLevel" NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 5,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "questions" JSONB NOT NULL,
    "passingScore" INTEGER NOT NULL DEFAULT 70,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "UserLessonProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "status" "LearningProgressStatus" NOT NULL DEFAULT 'not_started',
    "score" INTEGER,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "UserLessonProgress_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "GlossaryTerm" (
    "id" TEXT NOT NULL,
    "term" TEXT NOT NULL,
    "simpleDefinition" TEXT NOT NULL,
    "advancedDefinition" TEXT,
    "examples" JSONB NOT NULL,
    "relatedTerms" JSONB NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "GlossaryTerm_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PracticeAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "virtualBalance" DECIMAL(65,30) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PracticeAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradeIdea" (
    "id" TEXT NOT NULL,
    "sourceSignalId" TEXT,
    "asset" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "bias" "MarketBias" NOT NULL,
    "setupType" "TradeIdeaSetupType" NOT NULL,
    "timeframe" TEXT NOT NULL,
    "entryZoneLow" DECIMAL(65,30) NOT NULL,
    "entryZoneHigh" DECIMAL(65,30) NOT NULL,
    "invalidationLevel" DECIMAL(65,30) NOT NULL,
    "riskLevel" "RiskLabel" NOT NULL,
    "beginnerSuitability" "BeginnerSuitability" NOT NULL,
    "explanation" TEXT NOT NULL,
    "whatCouldGoWrong" TEXT NOT NULL,
    "aiConfidence" INTEGER,
    "analystStatus" "AnalystReviewStatus" NOT NULL DEFAULT 'draft',
    "analystNotes" TEXT,
    "publishedAt" TIMESTAMP(3),
    "outcomeStatus" "TradeIdeaOutcomeStatus",
    "outcomeSummary" TEXT,
    "publishedTelegramChatId" TEXT,
    "publishedTelegramMessageId" TEXT,
    "metadata" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TradeIdea_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradeIdeaBookmark" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeIdeaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TradeIdeaBookmark_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PracticeTrade" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "practiceAccountId" TEXT NOT NULL,
    "tradeIdeaId" TEXT,
    "asset" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "direction" "TradeDirection" NOT NULL,
    "entryPrice" DECIMAL(65,30) NOT NULL,
    "exitPrice" DECIMAL(65,30),
    "size" DECIMAL(65,30) NOT NULL,
    "stopLoss" DECIMAL(65,30),
    "takeProfit" DECIMAL(65,30),
    "status" "TradeLifecycleStatus" NOT NULL DEFAULT 'open',
    "pnl" DECIMAL(65,30),
    "notes" TEXT,
    "openedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PracticeTrade_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "TradeJournalEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tradeIdeaId" TEXT,
    "practiceTradeId" TEXT,
    "title" TEXT NOT NULL,
    "notes" TEXT NOT NULL,
    "emotion" "UserEmotion",
    "mistakeTags" JSONB NOT NULL,
    "ruleFollowed" BOOLEAN,
    "lessonsLearned" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "TradeJournalEntry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PersonalTradingRule" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "rule" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "PersonalTradingRule_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "RiskDisclosureAcceptance" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "disclosureVersion" TEXT NOT NULL,
    "acceptedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "RiskDisclosureAcceptance_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "WatchlistAsset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "asset" TEXT NOT NULL,
    "pair" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "WatchlistAsset_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");
CREATE UNIQUE INDEX "Lesson_slug_key" ON "Lesson"("slug");
CREATE UNIQUE INDEX "Quiz_lessonId_key" ON "Quiz"("lessonId");
CREATE UNIQUE INDEX "UserLessonProgress_userId_lessonId_key" ON "UserLessonProgress"("userId", "lessonId");
CREATE UNIQUE INDEX "GlossaryTerm_term_key" ON "GlossaryTerm"("term");
CREATE UNIQUE INDEX "TradeIdea_sourceSignalId_key" ON "TradeIdea"("sourceSignalId");
CREATE UNIQUE INDEX "TradeIdeaBookmark_userId_tradeIdeaId_key" ON "TradeIdeaBookmark"("userId", "tradeIdeaId");
CREATE UNIQUE INDEX "WatchlistAsset_userId_pair_key" ON "WatchlistAsset"("userId", "pair");

CREATE INDEX "UserLessonProgress_userId_status_idx" ON "UserLessonProgress"("userId", "status");
CREATE INDEX "PracticeAccount_userId_createdAt_idx" ON "PracticeAccount"("userId", "createdAt");
CREATE INDEX "PracticeTrade_userId_openedAt_idx" ON "PracticeTrade"("userId", "openedAt");
CREATE INDEX "TradeJournalEntry_userId_createdAt_idx" ON "TradeJournalEntry"("userId", "createdAt");
CREATE INDEX "RiskDisclosureAcceptance_userId_acceptedAt_idx" ON "RiskDisclosureAcceptance"("userId", "acceptedAt");

ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "LearningPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UserLessonProgress" ADD CONSTRAINT "UserLessonProgress_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PracticeAccount" ADD CONSTRAINT "PracticeAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeIdeaBookmark" ADD CONSTRAINT "TradeIdeaBookmark_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeIdeaBookmark" ADD CONSTRAINT "TradeIdeaBookmark_tradeIdeaId_fkey" FOREIGN KEY ("tradeIdeaId") REFERENCES "TradeIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PracticeTrade" ADD CONSTRAINT "PracticeTrade_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PracticeTrade" ADD CONSTRAINT "PracticeTrade_practiceAccountId_fkey" FOREIGN KEY ("practiceAccountId") REFERENCES "PracticeAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PracticeTrade" ADD CONSTRAINT "PracticeTrade_tradeIdeaId_fkey" FOREIGN KEY ("tradeIdeaId") REFERENCES "TradeIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TradeJournalEntry" ADD CONSTRAINT "TradeJournalEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "TradeJournalEntry" ADD CONSTRAINT "TradeJournalEntry_tradeIdeaId_fkey" FOREIGN KEY ("tradeIdeaId") REFERENCES "TradeIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "TradeJournalEntry" ADD CONSTRAINT "TradeJournalEntry_practiceTradeId_fkey" FOREIGN KEY ("practiceTradeId") REFERENCES "PracticeTrade"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "PersonalTradingRule" ADD CONSTRAINT "PersonalTradingRule_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "RiskDisclosureAcceptance" ADD CONSTRAINT "RiskDisclosureAcceptance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WatchlistAsset" ADD CONSTRAINT "WatchlistAsset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
