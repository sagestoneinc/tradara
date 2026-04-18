export interface AdminChannelAccessRow {
  userId: string;
  planLabel: string;
  subscriptionState: "active" | "grace_period" | "expired";
  entitlementState: "active" | "grace_period" | "inactive";
  accessState: "granted" | "pending_grant" | "pending_revoke" | "revoked";
  note: string;
  updatedAt: string;
}

export const channelAccessRows: AdminChannelAccessRow[] = [
  {
    userId: "user_active",
    planLabel: "Tradara Pro Monthly",
    subscriptionState: "active",
    entitlementState: "active",
    accessState: "granted",
    note: "Telegram membership confirmed from the latest webhook observation.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    userId: "user_grace",
    planLabel: "Tradara Pro Quarterly",
    subscriptionState: "grace_period",
    entitlementState: "grace_period",
    accessState: "pending_grant",
    note: "Grace period still allows delivery while payment recovery is pending.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  },
  {
    userId: "user_expired",
    planLabel: "Tradara Pro Monthly",
    subscriptionState: "expired",
    entitlementState: "inactive",
    accessState: "pending_revoke",
    note: "Access is queued for removal because billing no longer grants entitlement.",
    updatedAt: "2026-04-18T12:00:00.000Z"
  }
];

export const recentAuditEntries = [
  {
    id: "audit_001",
    action: "channel_access.grant_staged",
    actor: "channel-access-reconciliation",
    summary: "Grace-period account queued for premium access grant."
  },
  {
    id: "audit_002",
    action: "channel_access.membership_observed",
    actor: "telegram",
    summary: "Webhook confirmed user_active is still a member of the premium channel."
  },
  {
    id: "audit_003",
    action: "channel_access.revoke_staged",
    actor: "channel-access-reconciliation",
    summary: "Expired billing state queued a revoke for user_expired."
  }
];

