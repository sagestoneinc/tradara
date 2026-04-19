import { z } from "zod";

export const subscriptionPlanIdSchema = z.enum([
  "tradara-pro-monthly",
  "tradara-pro-quarterly",
  "tradara-pro-annual"
]);
export type SubscriptionPlanId = z.infer<typeof subscriptionPlanIdSchema>;

export const subscriptionStatusSchema = z.enum([
  "trialing",
  "active",
  "past_due",
  "grace_period",
  "canceled",
  "expired"
]);
export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const entitlementStatusSchema = z.enum(["inactive", "active", "grace_period"]);
export type EntitlementStatus = z.infer<typeof entitlementStatusSchema>;

export const channelAccessStatusSchema = z.enum([
  "pending_grant",
  "granted",
  "pending_revoke",
  "revoked",
  "error"
]);
export type ChannelAccessStatus = z.infer<typeof channelAccessStatusSchema>;

export const telegramInviteStatusSchema = z.enum([
  "pending",
  "issued",
  "consumed",
  "expired",
  "failed"
]);
export type TelegramInviteStatus = z.infer<typeof telegramInviteStatusSchema>;

export const auditActorTypeSchema = z.enum(["system", "admin", "job", "webhook"]);
export type AuditActorType = z.infer<typeof auditActorTypeSchema>;

export const providerNameSchema = z.enum(["telegram", "paymongo", "tradingview", "paypal", "xendit"]);
export type ProviderName = z.infer<typeof providerNameSchema>;
export const paymentProviderSchema = z.enum(["paypal", "xendit", "paymongo"]);
export type PaymentProvider = z.infer<typeof paymentProviderSchema>;

export const paymentEventTypeSchema = z.enum([
  // PayPal events
  "paypal.checkout.order_approved",
  "paypal.payment_capture.completed",
  "paypal.payment_capture.failed",
  // Xendit events
  "xendit.invoice.paid",
  "xendit.invoice.failed",
  "xendit.invoice.expired",
  // PayMongo events
  "paymongo.checkout_session.payment.paid",
  "paymongo.payment.paid",
  "paymongo.payment.failed"
]);
export type PaymentEventType = z.infer<typeof paymentEventTypeSchema>;
export const paymongoEventTypeSchema = z.enum([
  "checkout_session.payment.paid",
  "payment.paid",
  "payment.failed"
]);
export type PaymongoEventType = z.infer<typeof paymongoEventTypeSchema>;

export const integrationExecutionStateSchema = z.enum(["live", "pending", "stubbed"]);
export type IntegrationExecutionState = z.infer<typeof integrationExecutionStateSchema>;

export const signalStatusSchema = z.enum([
  "draft",
  "ai_scored",
  "pending_review",
  "approved",
  "edited",
  "rejected",
  "published",
  "canceled"
]);
export type SignalStatus = z.infer<typeof signalStatusSchema>;

export const signalSourceTypeSchema = z.enum(["tradingview", "manual", "ai_assisted"]);
export type SignalSourceType = z.infer<typeof signalSourceTypeSchema>;

export const tradeDirectionSchema = z.enum(["long", "short", "neutral"]);
export type TradeDirection = z.infer<typeof tradeDirectionSchema>;

export const riskLabelSchema = z.enum(["low", "medium", "high"]);
export type RiskLabel = z.infer<typeof riskLabelSchema>;

export const marketInsightStatusSchema = z.enum([
  "draft",
  "pending_review",
  "approved",
  "published",
  "rejected",
  "canceled"
]);
export type MarketInsightStatus = z.infer<typeof marketInsightStatusSchema>;

export const telegramExecutionStatusSchema = z.enum([
  "idle",
  "attempting",
  "retrying",
  "succeeded",
  "failed_retryable",
  "failed_non_retryable"
]);
export type TelegramExecutionStatus = z.infer<typeof telegramExecutionStatusSchema>;

export const telegramFailureKindSchema = z.enum(["retryable", "non_retryable"]);
export type TelegramFailureKind = z.infer<typeof telegramFailureKindSchema>;

export const adminTelegramConnectionStatusSchema = z.enum(["connected", "invited", "missing"]);
export type AdminTelegramConnectionStatus = z.infer<typeof adminTelegramConnectionStatusSchema>;

export const userSnapshotSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  email: z.string().email().nullable(),
  telegramHandle: z.string().nullable(),
  telegramUserId: z.string().nullable(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type UserSnapshot = z.infer<typeof userSnapshotSchema>;

export const subscriptionSnapshotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: subscriptionPlanIdSchema,
  status: subscriptionStatusSchema,
  providerName: providerNameSchema.optional(),
  currentPeriodEndsAt: z.string().datetime(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  canceledAt: z.string().datetime().nullable().optional(),
  providerCustomerId: z.string().nullable().optional(),
  providerSubscriptionId: z.string().nullable().optional()
});
export type SubscriptionSnapshot = z.infer<typeof subscriptionSnapshotSchema>;

export const entitlementSnapshotSchema = z.object({
  userId: z.string(),
  status: entitlementStatusSchema,
  sourceSubscriptionId: z.string().nullable(),
  premiumChannelEligible: z.boolean(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  reason: z.string()
});
export type EntitlementSnapshot = z.infer<typeof entitlementSnapshotSchema>;

export const telegramInviteRequestSchema = z.object({
  userId: z.string(),
  telegramUserId: z.string().min(1),
  channelId: z.string().min(1)
});
export type TelegramInviteRequest = z.infer<typeof telegramInviteRequestSchema>;

export const telegramInviteSchema = z.object({
  id: z.string(),
  userId: z.string(),
  channelId: z.string(),
  inviteUrl: z.string().url().nullable(),
  status: telegramInviteStatusSchema,
  expiresAt: z.string().datetime().nullable(),
  note: z.string()
});
export type TelegramInvite = z.infer<typeof telegramInviteSchema>;

export const channelAccessRecordSchema = z.object({
  id: z.string(),
  userId: z.string(),
  subscriptionId: z.string().nullable(),
  channelId: z.string(),
  telegramUserId: z.string().nullable(),
  status: channelAccessStatusSchema,
  desiredState: z.enum(["grant", "revoke"]),
  inviteId: z.string().nullable().optional(),
  lastSyncedAt: z.string().datetime().nullable(),
  lastError: z.string().nullable(),
  lastErrorCode: z.string().nullable().optional(),
  lastFailureKind: telegramFailureKindSchema.nullable().optional(),
  executionStatus: telegramExecutionStatusSchema.nullable().optional(),
  executionAttempts: z.number().int().nonnegative().optional(),
  lastExecutionAttemptAt: z.string().datetime().nullable().optional(),
  lastExecutionOutcomeAt: z.string().datetime().nullable().optional(),
  lastCorrelationId: z.string().nullable().optional(),
  updatedAt: z.string().datetime()
});
export type ChannelAccessRecord = z.infer<typeof channelAccessRecordSchema>;

export const reconciliationActionSchema = z.object({
  type: z.enum(["grant", "revoke", "noop"]),
  userId: z.string(),
  reason: z.string(),
  accessRecordId: z.string().nullable()
});
export type ReconciliationAction = z.infer<typeof reconciliationActionSchema>;

export const auditLogSchema = z.object({
  id: z.string(),
  actorType: auditActorTypeSchema,
  actorId: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime()
});
export type AuditLog = z.infer<typeof auditLogSchema>;

export const webhookEventSchema = z.object({
  id: z.string(),
  provider: providerNameSchema,
  providerEventId: z.string(),
  signatureValid: z.boolean(),
  payloadHash: z.string(),
  processedAt: z.string().datetime().nullable(),
  receivedAt: z.string().datetime()
});
export type WebhookEvent = z.infer<typeof webhookEventSchema>;

export const signalInputSnapshotSchema = z.object({
  id: z.string(),
  sourceType: signalSourceTypeSchema,
  sourceProvider: providerNameSchema.nullable(),
  sourceEventId: z.string().nullable(),
  symbol: z.string(),
  timeframe: z.string().nullable(),
  direction: tradeDirectionSchema.nullable(),
  entryZoneLow: z.number().nullable(),
  entryZoneHigh: z.number().nullable(),
  stopLoss: z.number().nullable(),
  takeProfit1: z.number().nullable(),
  takeProfit2: z.number().nullable(),
  takeProfit3: z.number().nullable(),
  marketPrice: z.number().nullable(),
  trendAlignment: z.number().int().min(0).max(100).nullable(),
  structureQuality: z.number().int().min(0).max(100).nullable(),
  volatilityQuality: z.number().int().min(0).max(100).nullable(),
  liquidityQuality: z.number().int().min(0).max(100).nullable(),
  riskRewardQuality: z.number().int().min(0).max(100).nullable(),
  conflictPenalty: z.number().int().min(0).max(100).nullable(),
  note: z.string().nullable(),
  strategyName: z.string().nullable(),
  detectedAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type SignalInputSnapshot = z.infer<typeof signalInputSnapshotSchema>;

export const signalSnapshotSchema = z.object({
  id: z.string(),
  signalInputId: z.string(),
  status: signalStatusSchema,
  sourceType: signalSourceTypeSchema,
  confidenceScore: z.number().int().min(0).max(100).nullable(),
  setupQualityScore: z.number().int().min(0).max(100).nullable(),
  riskLabel: riskLabelSchema.nullable(),
  invalidationSummary: z.string().nullable(),
  setupRationale: z.string().nullable(),
  marketContext: z.string().nullable(),
  warnings: z.array(z.string()),
  confidenceBreakdown: z.object({
    trendAlignment: z.number(),
    structureQuality: z.number(),
    volatilityQuality: z.number(),
    liquidityQuality: z.number(),
    riskRewardQuality: z.number(),
    conflictPenalty: z.number(),
    weightedPositiveScore: z.number(),
    finalScore: z.number()
  }),
  telegramDraft: z.string().nullable(),
  expertReviewNotes: z.string().nullable(),
  editedTelegramDraft: z.string().nullable(),
  publishedTelegramText: z.string().nullable(),
  publishedTelegramChatId: z.string().nullable(),
  publishedTelegramMessageId: z.string().nullable(),
  approvedBy: z.string().nullable(),
  approvedAt: z.string().datetime().nullable(),
  rejectedBy: z.string().nullable(),
  rejectedAt: z.string().datetime().nullable(),
  publishedBy: z.string().nullable(),
  publishedAt: z.string().datetime().nullable(),
  canceledAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type SignalSnapshot = z.infer<typeof signalSnapshotSchema>;

export const signalReviewSnapshotSchema = z.object({
  id: z.string(),
  signalId: z.string(),
  reviewerId: z.string(),
  resultingStatus: signalStatusSchema,
  notes: z.string().nullable(),
  editedTelegramDraft: z.string().nullable(),
  createdAt: z.string().datetime()
});
export type SignalReviewSnapshot = z.infer<typeof signalReviewSnapshotSchema>;

export const signalReviewActionSchema = z.enum(["approve", "edit", "reject", "cancel"]);
export type SignalReviewAction = z.infer<typeof signalReviewActionSchema>;

export const signalReviewRequestSchema = z.object({
  reviewerId: z.string().min(1),
  action: signalReviewActionSchema,
  notes: z.string().min(1).optional(),
  editedTelegramDraft: z.string().min(1).optional()
});
export type SignalReviewRequest = z.infer<typeof signalReviewRequestSchema>;

export const signalPublishRequestSchema = z.object({
  publisherId: z.string().min(1)
});
export type SignalPublishRequest = z.infer<typeof signalPublishRequestSchema>;

export const marketInsightSnapshotSchema = z.object({
  id: z.string(),
  status: marketInsightStatusSchema,
  symbol: z.string(),
  timeframe: z.string().nullable(),
  title: z.string(),
  summary: z.string(),
  body: z.string(),
  telegramDraft: z.string().nullable(),
  approvedBy: z.string().nullable(),
  approvedAt: z.string().datetime().nullable(),
  publishedBy: z.string().nullable(),
  publishedAt: z.string().datetime().nullable(),
  rejectedBy: z.string().nullable(),
  rejectedAt: z.string().datetime().nullable(),
  canceledAt: z.string().datetime().nullable(),
  metadata: z.record(z.string(), z.unknown()),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});
export type MarketInsightSnapshot = z.infer<typeof marketInsightSnapshotSchema>;

export const signalPublishMetadataSchema = z.object({
  chatId: z.string(),
  messageId: z.string(),
  publishedAt: z.string().datetime()
});
export type SignalPublishMetadata = z.infer<typeof signalPublishMetadataSchema>;

export const createSignalInputRequestSchema = z.object({
  sourceType: signalSourceTypeSchema,
  sourceProvider: providerNameSchema.nullable().optional(),
  sourceEventId: z.string().nullable().optional(),
  symbol: z.string().min(1),
  timeframe: z.string().nullable().optional(),
  direction: tradeDirectionSchema.nullable().optional(),
  entryZoneLow: z.number().nullable().optional(),
  entryZoneHigh: z.number().nullable().optional(),
  stopLoss: z.number().nullable().optional(),
  takeProfit1: z.number().nullable().optional(),
  takeProfit2: z.number().nullable().optional(),
  takeProfit3: z.number().nullable().optional(),
  marketPrice: z.number().nullable().optional(),
  trendAlignment: z.number().int().min(0).max(100).nullable().optional(),
  structureQuality: z.number().int().min(0).max(100).nullable().optional(),
  volatilityQuality: z.number().int().min(0).max(100).nullable().optional(),
  liquidityQuality: z.number().int().min(0).max(100).nullable().optional(),
  riskRewardQuality: z.number().int().min(0).max(100).nullable().optional(),
  conflictPenalty: z.number().int().min(0).max(100).nullable().optional(),
  note: z.string().nullable().optional(),
  strategyName: z.string().nullable().optional(),
  detectedAt: z.string().datetime().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});
export type CreateSignalInputRequest = z.infer<typeof createSignalInputRequestSchema>;

export const createMarketInsightRequestSchema = z.object({
  symbol: z.string().min(1),
  timeframe: z.string().nullable().optional(),
  title: z.string().min(1),
  summary: z.string().min(1),
  body: z.string().min(1),
  metadata: z.record(z.string(), z.unknown()).optional()
});
export type CreateMarketInsightRequest = z.infer<typeof createMarketInsightRequestSchema>;

export const signalScoringInputSchema = z.object({
  trendAlignment: z.number().int().min(0).max(100),
  structureQuality: z.number().int().min(0).max(100),
  volatilityQuality: z.number().int().min(0).max(100),
  liquidityQuality: z.number().int().min(0).max(100),
  riskRewardQuality: z.number().int().min(0).max(100),
  conflictPenalty: z.number().int().min(0).max(100)
});
export type SignalScoringInput = z.infer<typeof signalScoringInputSchema>;

export const signalScoringResultSchema = z.object({
  weightedPositiveScore: z.number(),
  finalScore: z.number(),
  setupQualityScore: z.number().int().min(0).max(100),
  confidenceScore: z.number().int().min(0).max(100),
  riskLabel: riskLabelSchema,
  breakdown: z.object({
    trendAlignment: z.number(),
    structureQuality: z.number(),
    volatilityQuality: z.number(),
    liquidityQuality: z.number(),
    riskRewardQuality: z.number(),
    conflictPenalty: z.number()
  })
});
export type SignalScoringResult = z.infer<typeof signalScoringResultSchema>;

export const signalAiEnrichmentSchema = z.object({
  rationale: z.string(),
  marketContext: z.string(),
  warnings: z.array(z.string()),
  confidenceBreakdown: signalScoringResultSchema,
  confidenceScore: z.number().int().min(0).max(100),
  riskLabel: riskLabelSchema,
  invalidationSummary: z.string(),
  telegramDraft: z.string()
});
export type SignalAiEnrichment = z.infer<typeof signalAiEnrichmentSchema>;

export const adminSubscriberSnapshotSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  email: z.string().email().nullable(),
  telegramHandle: z.string().nullable(),
  telegramUserId: z.string().nullable(),
  telegramConnectionStatus: adminTelegramConnectionStatusSchema,
  subscriptionId: z.string().nullable(),
  planId: subscriptionPlanIdSchema.nullable(),
  planLabel: z.string(),
  subscriptionState: subscriptionStatusSchema.nullable(),
  entitlementState: entitlementStatusSchema,
  accessState: channelAccessStatusSchema.nullable(),
  executionStatus: telegramExecutionStatusSchema.nullable().optional(),
  lastError: z.string().nullable().optional(),
  lastErrorCode: z.string().nullable().optional(),
  lastFailureKind: telegramFailureKindSchema.nullable().optional(),
  lastCorrelationId: z.string().nullable().optional(),
  currentPeriodEndsAt: z.string().datetime().nullable(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
  note: z.string()
});
export type AdminSubscriberSnapshot = z.infer<typeof adminSubscriberSnapshotSchema>;

export const adminPlanSnapshotSchema = z.object({
  id: subscriptionPlanIdSchema,
  label: z.string(),
  billingInterval: z.enum(["month", "quarter", "year"]),
  amountPhp: z.number().int().nonnegative(),
  subscriberCount: z.number().int().nonnegative(),
  healthySubscribers: z.number().int().nonnegative(),
  watchlistSubscribers: z.number().int().nonnegative()
});
export type AdminPlanSnapshot = z.infer<typeof adminPlanSnapshotSchema>;

export const adminPaymentsSummarySchema = z.object({
  provider: z.union([paymentProviderSchema, z.literal("mixed")]),
  executionState: integrationExecutionStateSchema,
  activeSubscriptions: z.number().int().nonnegative(),
  recoverySubscriptions: z.number().int().nonnegative(),
  expiredSubscriptions: z.number().int().nonnegative(),
  lastEventType: paymentEventTypeSchema.nullable().optional(),
  note: z.string(),
  lastEvaluatedAt: z.string().datetime()
});
export type AdminPaymentsSummary = z.infer<typeof adminPaymentsSummarySchema>;

export const adminAuditEntrySchema = z.object({
  id: z.string(),
  actor: z.string(),
  actorType: auditActorTypeSchema,
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  correlationId: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  summary: z.string()
});
export type AdminAuditEntry = z.infer<typeof adminAuditEntrySchema>;

export const adminOverviewDataSchema = z.object({
  generatedAt: z.string().datetime(),
  telegramAutomationState: integrationExecutionStateSchema,
  billingExecutionState: integrationExecutionStateSchema,
  metrics: z.object({
    grantedAccess: z.number().int().nonnegative(),
    pendingActions: z.number().int().nonnegative(),
    atRiskAccounts: z.number().int().nonnegative()
  }),
  paymentsSummary: adminPaymentsSummarySchema,
  recentAuditEntries: z.array(adminAuditEntrySchema)
});
export type AdminOverviewData = z.infer<typeof adminOverviewDataSchema>;

export const adminUsersDataSchema = z.object({
  generatedAt: z.string().datetime(),
  metrics: z.object({
    telegramConnected: z.number().int().nonnegative(),
    pendingLinking: z.number().int().nonnegative(),
    supportWatchlist: z.number().int().nonnegative()
  }),
  rows: z.array(adminSubscriberSnapshotSchema)
});
export type AdminUsersData = z.infer<typeof adminUsersDataSchema>;

export const adminSubscriptionsDataSchema = z.object({
  generatedAt: z.string().datetime(),
  billingExecutionState: integrationExecutionStateSchema,
  metrics: z.object({
    activeEntitlements: z.number().int().nonnegative(),
    recoveryQueue: z.number().int().nonnegative(),
    endingWithin14Days: z.number().int().nonnegative()
  }),
  plans: z.array(adminPlanSnapshotSchema),
  rows: z.array(adminSubscriberSnapshotSchema),
  paymentsSummary: adminPaymentsSummarySchema
});
export type AdminSubscriptionsData = z.infer<typeof adminSubscriptionsDataSchema>;

export const adminChannelAccessDataSchema = z.object({
  generatedAt: z.string().datetime(),
  telegramAutomationState: integrationExecutionStateSchema,
  rows: z.array(adminSubscriberSnapshotSchema)
});
export type AdminChannelAccessData = z.infer<typeof adminChannelAccessDataSchema>;

export const adminAuditLogListDataSchema = z.object({
  generatedAt: z.string().datetime(),
  rows: z.array(adminAuditEntrySchema)
});
export type AdminAuditLogListData = z.infer<typeof adminAuditLogListDataSchema>;

export const adminWebhookEventSnapshotSchema = z.object({
  id: z.string(),
  provider: providerNameSchema,
  providerEventId: z.string(),
  signatureValid: z.boolean(),
  processedAt: z.string().datetime().nullable(),
  receivedAt: z.string().datetime(),
  payloadHash: z.string()
});
export type AdminWebhookEventSnapshot = z.infer<typeof adminWebhookEventSnapshotSchema>;

export const adminWebhookEventsDataSchema = z.object({
  generatedAt: z.string().datetime(),
  metrics: z.object({
    totalEvents: z.number().int().nonnegative(),
    processedEvents: z.number().int().nonnegative(),
    pendingEvents: z.number().int().nonnegative()
  }),
  rows: z.array(adminWebhookEventSnapshotSchema)
});
export type AdminWebhookEventsData = z.infer<typeof adminWebhookEventsDataSchema>;

export const adminDeliveryFailureSnapshotSchema = z.object({
  userId: z.string(),
  displayName: z.string(),
  accessState: channelAccessStatusSchema.nullable(),
  executionStatus: telegramExecutionStatusSchema.nullable(),
  lastError: z.string().nullable(),
  lastErrorCode: z.string().nullable(),
  lastFailureKind: telegramFailureKindSchema.nullable(),
  lastCorrelationId: z.string().nullable(),
  updatedAt: z.string().datetime()
});
export type AdminDeliveryFailureSnapshot = z.infer<typeof adminDeliveryFailureSnapshotSchema>;

export const adminDiagnosticsDataSchema = z.object({
  generatedAt: z.string().datetime(),
  telegramAutomationState: integrationExecutionStateSchema,
  metrics: z.object({
    recentWebhookEvents: z.number().int().nonnegative(),
    deliveryFailures: z.number().int().nonnegative(),
    retryableFailures: z.number().int().nonnegative()
  }),
  recentWebhookEvents: z.array(adminWebhookEventSnapshotSchema),
  recentDeliveryActivity: z.array(adminAuditEntrySchema),
  deliveryFailures: z.array(adminDeliveryFailureSnapshotSchema)
});
export type AdminDiagnosticsData = z.infer<typeof adminDiagnosticsDataSchema>;

export const adminSignalRowSchema = z.object({
  id: z.string(),
  contentType: z.enum(["signal", "market_insight"]),
  state: z.union([signalStatusSchema, marketInsightStatusSchema]),
  symbol: z.string(),
  timeframe: z.string().nullable(),
  direction: z.string().nullable(),
  sourceProvider: providerNameSchema,
  confidenceScore: z.number().int().min(0).max(100).nullable(),
  setupQualityScore: z.number().int().min(0).max(100).nullable(),
  riskLabel: riskLabelSchema.nullable(),
  approvedBy: z.string().nullable(),
  publishedAt: z.string().datetime().nullable(),
  updatedAt: z.string().datetime(),
  summary: z.string(),
  telegramPreview: z.string().nullable()
});
export type AdminSignalRow = z.infer<typeof adminSignalRowSchema>;

export const adminSignalsDataSchema = z.object({
  generatedAt: z.string().datetime(),
  metrics: z.object({
    drafts: z.number().int().nonnegative(),
    pendingReview: z.number().int().nonnegative(),
    published: z.number().int().nonnegative(),
    rejected: z.number().int().nonnegative()
  }),
  rows: z.array(adminSignalRowSchema)
});
export type AdminSignalsData = z.infer<typeof adminSignalsDataSchema>;

export const createBillingCheckoutSessionRequestSchema = z.object({
  userId: z.string().min(1),
  planId: subscriptionPlanIdSchema,
  provider: paymentProviderSchema.optional(),
  email: z.string().email().nullable().optional(),
  successUrl: z.string().url().nullable().optional(),
  cancelUrl: z.string().url().nullable().optional()
});
export type CreateBillingCheckoutSessionRequest = z.infer<
  typeof createBillingCheckoutSessionRequestSchema
>;

export const billingCheckoutSessionScaffoldSchema = z.object({
  executionState: integrationExecutionStateSchema,
  provider: paymentProviderSchema,
  userId: z.string(),
  planId: subscriptionPlanIdSchema,
  checkoutUrl: z.string().url().nullable(),
  providerCheckoutSessionId: z.string().nullable(),
  metadata: z.object({
    tradaraUserId: z.string(),
    tradaraPlanId: subscriptionPlanIdSchema,
    tradaraSubscriptionId: z.string()
  }),
  note: z.string()
});
export type BillingCheckoutSessionScaffold = z.infer<typeof billingCheckoutSessionScaffoldSchema>;
