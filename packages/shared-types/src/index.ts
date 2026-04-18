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

export const providerNameSchema = z.enum(["telegram", "paymongo", "tradingview"]);
export type ProviderName = z.infer<typeof providerNameSchema>;

export const subscriptionSnapshotSchema = z.object({
  id: z.string(),
  userId: z.string(),
  planId: subscriptionPlanIdSchema,
  status: subscriptionStatusSchema,
  currentPeriodEndsAt: z.string().datetime(),
  gracePeriodEndsAt: z.string().datetime().nullable(),
  canceledAt: z.string().datetime().nullable().optional()
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

