import { Client, Databases, ID } from "node-appwrite";

const endpoint = process.env.APPWRITE_ENDPOINT ?? "";
const projectId = process.env.APPWRITE_PROJECT_ID ?? "";
const apiKey = process.env.APPWRITE_API_KEY ?? "";
const databaseId = process.env.APPWRITE_DATABASE_ID ?? "";

if (!endpoint || !projectId || !apiKey || !databaseId) {
  console.error(
    "Missing required env vars: APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID, APPWRITE_API_KEY, APPWRITE_DATABASE_ID"
  );
  process.exit(1);
}

const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
const databases = new Databases(client);

async function createCollectionSafe(
  collectionId: string,
  collectionName: string
): Promise<void> {
  try {
    await databases.createCollection(databaseId, collectionId, collectionName);
    console.log(`Created collection: ${collectionId}`);
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes("already exists")) {
      console.log(`Collection already exists: ${collectionId}`);
      return;
    }
    throw error;
  }
}

async function createStringAttr(
  collectionId: string,
  key: string,
  size: number,
  required: boolean,
  defaultValue?: string | null
): Promise<void> {
  try {
    await databases.createStringAttribute(
      databaseId,
      collectionId,
      key,
      size,
      required,
      defaultValue ?? undefined
    );
  } catch {
    // ignore duplicate attribute errors
  }
}

async function createBoolAttr(
  collectionId: string,
  key: string,
  required: boolean,
  defaultValue?: boolean
): Promise<void> {
  try {
    await databases.createBooleanAttribute(
      databaseId,
      collectionId,
      key,
      required,
      defaultValue
    );
  } catch {
    // ignore duplicate attribute errors
  }
}

async function createIntAttr(
  collectionId: string,
  key: string,
  required: boolean,
  min?: number,
  max?: number,
  defaultValue?: number
): Promise<void> {
  try {
    await databases.createIntegerAttribute(
      databaseId,
      collectionId,
      key,
      required,
      min,
      max,
      defaultValue
    );
  } catch {
    // ignore duplicate attribute errors
  }
}

async function createFloatAttr(
  collectionId: string,
  key: string,
  required: boolean,
  defaultValue?: number
): Promise<void> {
  try {
    await databases.createFloatAttribute(databaseId, collectionId, key, required, undefined, undefined, defaultValue);
  } catch {
    // ignore duplicate attribute errors
  }
}

async function createDatetimeAttr(
  collectionId: string,
  key: string,
  required: boolean
): Promise<void> {
  try {
    await databases.createDatetimeAttribute(databaseId, collectionId, key, required);
  } catch {
    // ignore duplicate attribute errors
  }
}

async function setupUsers(): Promise<void> {
  await createCollectionSafe("users", "Users");
  await createStringAttr("users", "email", 320, false);
  await createStringAttr("users", "clerkUserId", 255, false);
  await createStringAttr("users", "displayName", 255, false);
  await createStringAttr("users", "telegramUserId", 64, false);
  await createStringAttr("users", "telegramHandle", 128, false);
  await createStringAttr("users", "telegramLinkState", 32, false, "unlinked");
  await createDatetimeAttr("users", "telegramLinkedAt", false);
  await createDatetimeAttr("users", "lastLoginAt", false);
  await createStringAttr("users", "createdAt", 64, true);
  await createStringAttr("users", "updatedAt", 64, true);
}

async function setupSubscriptions(): Promise<void> {
  await createCollectionSafe("subscriptions", "Subscriptions");
  await createStringAttr("subscriptions", "userId", 255, true);
  await createStringAttr("subscriptions", "planId", 64, true);
  await createStringAttr("subscriptions", "status", 32, true);
  await createStringAttr("subscriptions", "providerName", 32, false);
  await createStringAttr("subscriptions", "providerCustomerId", 255, false);
  await createStringAttr("subscriptions", "providerSubscriptionId", 255, false);
  await createStringAttr("subscriptions", "currentPeriodEndsAt", 64, true);
  await createStringAttr("subscriptions", "gracePeriodEndsAt", 64, false);
  await createStringAttr("subscriptions", "canceledAt", 64, false);
}

async function setupChannelAccess(): Promise<void> {
  await createCollectionSafe("channel_access", "Channel Access");
  await createStringAttr("channel_access", "userId", 255, true);
  await createStringAttr("channel_access", "subscriptionId", 255, false);
  await createStringAttr("channel_access", "channelId", 255, true);
  await createStringAttr("channel_access", "telegramUserId", 64, false);
  await createStringAttr("channel_access", "status", 32, true);
  await createStringAttr("channel_access", "desiredState", 16, true);
  await createStringAttr("channel_access", "inviteId", 255, false);
  await createStringAttr("channel_access", "lastSyncedAt", 64, false);
  await createStringAttr("channel_access", "lastError", 1024, false);
  await createStringAttr("channel_access", "lastErrorCode", 64, false);
  await createStringAttr("channel_access", "lastFailureKind", 32, false);
  await createStringAttr("channel_access", "executionStatus", 32, false);
  await createIntAttr("channel_access", "executionAttempts", false, 0);
  await createStringAttr("channel_access", "lastExecutionAttemptAt", 64, false);
  await createStringAttr("channel_access", "lastExecutionOutcomeAt", 64, false);
  await createStringAttr("channel_access", "lastCorrelationId", 255, false);
  await createStringAttr("channel_access", "updatedAt", 64, true);
}

async function setupTelegramInvites(): Promise<void> {
  await createCollectionSafe("telegram_invites", "Telegram Invites");
  await createStringAttr("telegram_invites", "userId", 255, true);
  await createStringAttr("telegram_invites", "channelId", 255, true);
  await createStringAttr("telegram_invites", "inviteUrl", 1024, false);
  await createStringAttr("telegram_invites", "status", 32, true);
  await createStringAttr("telegram_invites", "expiresAt", 64, false);
  await createStringAttr("telegram_invites", "note", 1024, false, "");
}

async function setupTelegramLinkSessions(): Promise<void> {
  await createCollectionSafe("telegram_link_sessions", "Telegram Link Sessions");
  await createStringAttr("telegram_link_sessions", "userId", 255, true);
  await createStringAttr("telegram_link_sessions", "clerkUserId", 255, true);
  await createStringAttr("telegram_link_sessions", "tokenHash", 255, true);
  await createStringAttr("telegram_link_sessions", "expiresAt", 64, true);
  await createStringAttr("telegram_link_sessions", "consumedAt", 64, false);
  await createStringAttr("telegram_link_sessions", "createdAt", 64, true);
}

async function setupAuditLogs(): Promise<void> {
  await createCollectionSafe("audit_logs", "Audit Logs");
  await createStringAttr("audit_logs", "actorType", 32, true);
  await createStringAttr("audit_logs", "actorId", 255, true);
  await createStringAttr("audit_logs", "action", 255, true);
  await createStringAttr("audit_logs", "entityType", 128, true);
  await createStringAttr("audit_logs", "entityId", 255, true);
  await createStringAttr("audit_logs", "metadata", 65535, false, "{}");
  await createStringAttr("audit_logs", "createdAt", 64, true);
}

async function setupWebhookEvents(): Promise<void> {
  await createCollectionSafe("webhook_events", "Webhook Events");
  await createStringAttr("webhook_events", "provider", 32, true);
  await createStringAttr("webhook_events", "providerEventId", 255, true);
  await createStringAttr("webhook_events", "payloadHash", 255, true);
  await createBoolAttr("webhook_events", "signatureValid", true, false);
  await createStringAttr("webhook_events", "processedAt", 64, false);
  await createStringAttr("webhook_events", "receivedAt", 64, true);
}

async function setupSignalInputs(): Promise<void> {
  await createCollectionSafe("signal_inputs", "Signal Inputs");
  await createStringAttr("signal_inputs", "sourceType", 32, true);
  await createStringAttr("signal_inputs", "sourceProvider", 32, false);
  await createStringAttr("signal_inputs", "sourceEventId", 255, false);
  await createStringAttr("signal_inputs", "symbol", 32, true);
  await createStringAttr("signal_inputs", "timeframe", 16, false);
  await createStringAttr("signal_inputs", "direction", 16, false);
  await createFloatAttr("signal_inputs", "entryZoneLow", false);
  await createFloatAttr("signal_inputs", "entryZoneHigh", false);
  await createFloatAttr("signal_inputs", "stopLoss", false);
  await createFloatAttr("signal_inputs", "takeProfit1", false);
  await createFloatAttr("signal_inputs", "takeProfit2", false);
  await createFloatAttr("signal_inputs", "takeProfit3", false);
  await createFloatAttr("signal_inputs", "marketPrice", false);
  await createIntAttr("signal_inputs", "trendAlignment", false, 0, 100);
  await createIntAttr("signal_inputs", "structureQuality", false, 0, 100);
  await createIntAttr("signal_inputs", "volatilityQuality", false, 0, 100);
  await createIntAttr("signal_inputs", "liquidityQuality", false, 0, 100);
  await createIntAttr("signal_inputs", "riskRewardQuality", false, 0, 100);
  await createIntAttr("signal_inputs", "conflictPenalty", false, 0, 100);
  await createStringAttr("signal_inputs", "note", 4096, false);
  await createStringAttr("signal_inputs", "strategyName", 255, false);
  await createStringAttr("signal_inputs", "detectedAt", 64, false);
  await createStringAttr("signal_inputs", "metadata", 65535, false, "{}");
  await createStringAttr("signal_inputs", "createdAt", 64, true);
  await createStringAttr("signal_inputs", "updatedAt", 64, true);
}

async function setupSignals(): Promise<void> {
  await createCollectionSafe("signals", "Signals");
  await createStringAttr("signals", "signalInputId", 255, true);
  await createStringAttr("signals", "status", 32, true);
  await createStringAttr("signals", "sourceType", 32, true);
  await createIntAttr("signals", "confidenceScore", false, 0, 100);
  await createIntAttr("signals", "setupQualityScore", false, 0, 100);
  await createStringAttr("signals", "riskLabel", 16, false);
  await createStringAttr("signals", "publishRecommendation", 32, false);
  await createStringAttr("signals", "invalidationSummary", 4096, false);
  await createStringAttr("signals", "setupRationale", 4096, false);
  await createStringAttr("signals", "marketContext", 4096, false);
  await createStringAttr("signals", "warnings", 65535, false, "[]");
  await createStringAttr("signals", "confidenceBreakdown", 65535, false, "{}");
  await createStringAttr("signals", "telegramDraft", 65535, false);
  await createStringAttr("signals", "expertReviewNotes", 4096, false);
  await createStringAttr("signals", "editedTelegramDraft", 65535, false);
  await createStringAttr("signals", "publishedTelegramText", 65535, false);
  await createStringAttr("signals", "publishedTelegramChatId", 64, false);
  await createStringAttr("signals", "publishedTelegramMessageId", 64, false);
  await createStringAttr("signals", "approvedBy", 255, false);
  await createStringAttr("signals", "approvedAt", 64, false);
  await createStringAttr("signals", "rejectedBy", 255, false);
  await createStringAttr("signals", "rejectedAt", 64, false);
  await createStringAttr("signals", "publishedBy", 255, false);
  await createStringAttr("signals", "publishedAt", 64, false);
  await createStringAttr("signals", "canceledAt", 64, false);
  await createStringAttr("signals", "metadata", 65535, false, "{}");
  await createStringAttr("signals", "createdAt", 64, true);
  await createStringAttr("signals", "updatedAt", 64, true);
}

async function setupSignalReviews(): Promise<void> {
  await createCollectionSafe("signal_reviews", "Signal Reviews");
  await createStringAttr("signal_reviews", "signalId", 255, true);
  await createStringAttr("signal_reviews", "reviewerId", 255, true);
  await createStringAttr("signal_reviews", "resultingStatus", 32, true);
  await createStringAttr("signal_reviews", "notes", 4096, false);
  await createStringAttr("signal_reviews", "editedTelegramDraft", 65535, false);
  await createStringAttr("signal_reviews", "createdAt", 64, true);
}

async function setupMarketInsights(): Promise<void> {
  await createCollectionSafe("market_insights", "Market Insights");
  await createStringAttr("market_insights", "status", 32, true);
  await createStringAttr("market_insights", "symbol", 32, true);
  await createStringAttr("market_insights", "timeframe", 16, false);
  await createStringAttr("market_insights", "title", 512, true);
  await createStringAttr("market_insights", "summary", 4096, true);
  await createStringAttr("market_insights", "body", 65535, true);
  await createStringAttr("market_insights", "btcBias", 16, true);
  await createStringAttr("market_insights", "ethBias", 16, true);
  await createStringAttr("market_insights", "altcoinBias", 16, true);
  await createStringAttr("market_insights", "riskEnvironment", 16, true);
  await createStringAttr("market_insights", "executionPosture", 16, true);
  await createStringAttr("market_insights", "warnings", 65535, false, "[]");
  await createStringAttr("market_insights", "telegramDraft", 65535, false);
  await createStringAttr("market_insights", "approvedBy", 255, false);
  await createStringAttr("market_insights", "approvedAt", 64, false);
  await createStringAttr("market_insights", "publishedBy", 255, false);
  await createStringAttr("market_insights", "publishedAt", 64, false);
  await createStringAttr("market_insights", "rejectedBy", 255, false);
  await createStringAttr("market_insights", "rejectedAt", 64, false);
  await createStringAttr("market_insights", "canceledAt", 64, false);
  await createStringAttr("market_insights", "metadata", 65535, false, "{}");
  await createStringAttr("market_insights", "createdAt", 64, true);
  await createStringAttr("market_insights", "updatedAt", 64, true);
}

async function main(): Promise<void> {
  console.log("Setting up Appwrite database collections...");

  await setupUsers();
  await setupSubscriptions();
  await setupChannelAccess();
  await setupTelegramInvites();
  await setupTelegramLinkSessions();
  await setupAuditLogs();
  await setupWebhookEvents();
  await setupSignalInputs();
  await setupSignals();
  await setupSignalReviews();
  await setupMarketInsights();

  console.log("Database setup complete.");
}

main().catch((error: unknown) => {
  console.error("Setup failed:", error);
  process.exit(1);
});
