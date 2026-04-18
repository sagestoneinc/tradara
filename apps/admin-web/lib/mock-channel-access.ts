import { subscriptionPlans } from "@tradara/shared-config";
import type {
  ChannelAccessStatus,
  EntitlementStatus,
  SubscriptionPlanId,
  SubscriptionStatus
} from "@tradara/shared-types";

import type { TelegramConnectionStatus } from "./admin-status";

export interface AdminSubscriberRecord {
  userId: string;
  displayName: string;
  email: string;
  telegramHandle: string | null;
  telegramUserId: string | null;
  telegramConnectionStatus: TelegramConnectionStatus;
  subscriptionId: string;
  planId: SubscriptionPlanId;
  subscriptionState: SubscriptionStatus;
  entitlementState: EntitlementStatus;
  accessState: ChannelAccessStatus;
  currentPeriodEndsAt: string;
  gracePeriodEndsAt: string | null;
  updatedAt: string;
  note: string;
}

export const adminSubscriberRecords: AdminSubscriberRecord[] = [
  {
    displayName: "Mara Santos",
    email: "mara@tradara.test",
    telegramHandle: "@marasignals",
    telegramUserId: "1002003001",
    telegramConnectionStatus: "connected",
    subscriptionId: "sub_001",
    userId: "user_active",
    planId: "tradara-pro-monthly",
    subscriptionState: "active",
    entitlementState: "active",
    accessState: "granted",
    currentPeriodEndsAt: "2026-05-12T12:00:00.000Z",
    gracePeriodEndsAt: null,
    note: "Telegram membership confirmed from the latest webhook observation.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    displayName: "Iris Dela Cruz",
    email: "iris@tradara.test",
    telegramHandle: "@iris_macro",
    telegramUserId: "1002003002",
    telegramConnectionStatus: "invited",
    subscriptionId: "sub_002",
    userId: "user_grace",
    planId: "tradara-pro-quarterly",
    subscriptionState: "grace_period",
    entitlementState: "grace_period",
    accessState: "pending_grant",
    currentPeriodEndsAt: "2026-04-20T12:00:00.000Z",
    gracePeriodEndsAt: "2026-04-22T12:00:00.000Z",
    note: "Grace period still allows delivery while payment recovery is pending and the latest invite remains open.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    displayName: "Noah Velasco",
    email: "noah@tradara.test",
    telegramHandle: null,
    telegramUserId: null,
    telegramConnectionStatus: "missing",
    subscriptionId: "sub_003",
    userId: "user_trial",
    planId: "tradara-pro-annual",
    subscriptionState: "trialing",
    entitlementState: "active",
    accessState: "pending_grant",
    currentPeriodEndsAt: "2026-04-25T12:00:00.000Z",
    gracePeriodEndsAt: null,
    note: "Billing granted access, but delivery is blocked until the subscriber completes Telegram linking.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    displayName: "Clara Reyes",
    email: "clara@tradara.test",
    telegramHandle: "@clarareads",
    telegramUserId: "1002003004",
    telegramConnectionStatus: "connected",
    subscriptionId: "sub_004",
    userId: "user_canceled",
    planId: "tradara-pro-annual",
    subscriptionState: "canceled",
    entitlementState: "active",
    accessState: "granted",
    currentPeriodEndsAt: "2026-04-27T12:00:00.000Z",
    gracePeriodEndsAt: null,
    note: "Subscriber canceled renewal, but entitlement stays active until the prepaid period ends.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    displayName: "Luca Ramos",
    email: "luca@tradara.test",
    telegramHandle: "@lucarunslevels",
    telegramUserId: "1002003005",
    telegramConnectionStatus: "connected",
    subscriptionId: "sub_005",
    userId: "user_expired",
    planId: "tradara-pro-monthly",
    subscriptionState: "expired",
    entitlementState: "inactive",
    accessState: "pending_revoke",
    currentPeriodEndsAt: "2026-04-10T12:00:00.000Z",
    gracePeriodEndsAt: null,
    note: "Access is queued for removal because billing no longer grants entitlement, even though Telegram still shows membership.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  }
];

export interface AdminChannelAccessRow {
  userId: string;
  displayName: string;
  planLabel: string;
  subscriptionState: SubscriptionStatus;
  entitlementState: EntitlementStatus;
  accessState: ChannelAccessStatus;
  note: string;
  updatedAt: string;
}

export const channelAccessRows: AdminChannelAccessRow[] = adminSubscriberRecords.map((record) => ({
  userId: record.userId,
  displayName: record.displayName,
  planLabel: subscriptionPlans[record.planId].label,
  subscriptionState: record.subscriptionState,
  entitlementState: record.entitlementState,
  accessState: record.accessState,
  note: record.note,
  updatedAt: record.updatedAt
}));

export const subscriptionPlanSnapshots = Object.values(subscriptionPlans).map((plan) => {
  const planSubscribers = adminSubscriberRecords.filter((record) => record.planId === plan.id);
  const healthySubscribers = planSubscribers.filter((record) => record.entitlementState === "active").length;
  const watchlistSubscribers = planSubscribers.filter(
    (record) => record.entitlementState !== "active" || record.telegramConnectionStatus !== "connected"
  ).length;

  return {
    ...plan,
    subscriberCount: planSubscribers.length,
    healthySubscribers,
    watchlistSubscribers
  };
});

export const recentAuditEntries = [
  {
    id: "audit_001",
    action: "channel_access.grant_staged",
    actor: "channel-access-reconciliation",
    summary: "Grace-period account queued for premium access grant after the latest billing sync."
  },
  {
    id: "audit_002",
    action: "channel_access.membership_observed",
    actor: "telegram",
    summary: "Webhook confirmed Mara Santos is still a member of the premium channel."
  },
  {
    id: "audit_003",
    action: "channel_access.linking_required",
    actor: "system",
    summary: "Trial subscriber Noah Velasco needs Telegram linking before invite issuance can proceed."
  },
  {
    id: "audit_004",
    action: "channel_access.revoke_staged",
    actor: "channel-access-reconciliation",
    summary: "Expired billing state queued a revoke for Luca Ramos."
  }
];
