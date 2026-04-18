import { describe, expect, it } from "vitest";

import {
  getChannelAccessMetrics,
  getConnectedRatio,
  getPriorityAccessRows
} from "../lib/admin-view-models";

const rows = [
  {
    userId: "user_active",
    displayName: "user_active",
    email: null,
    telegramHandle: null,
    telegramUserId: "10001",
    telegramConnectionStatus: "connected" as const,
    subscriptionId: "sub_1",
    planId: "tradara-pro-monthly" as const,
    planLabel: "Tradara Pro Monthly",
    subscriptionState: "active" as const,
    entitlementState: "active" as const,
    accessState: "granted" as const,
    currentPeriodEndsAt: "2026-05-01T12:00:00.000Z",
    gracePeriodEndsAt: null,
    updatedAt: "2026-04-18T12:00:00.000Z",
    note: "Observed as granted."
  },
  {
    userId: "user_grace",
    displayName: "user_grace",
    email: null,
    telegramHandle: null,
    telegramUserId: "10002",
    telegramConnectionStatus: "invited" as const,
    subscriptionId: "sub_2",
    planId: "tradara-pro-quarterly" as const,
    planLabel: "Tradara Pro Quarterly",
    subscriptionState: "grace_period" as const,
    entitlementState: "grace_period" as const,
    accessState: "pending_grant" as const,
    currentPeriodEndsAt: "2026-04-21T12:00:00.000Z",
    gracePeriodEndsAt: "2026-04-22T12:00:00.000Z",
    updatedAt: "2026-04-18T12:00:00.000Z",
    note: "Waiting on stubbed invite execution."
  },
  {
    userId: "user_expired",
    displayName: "user_expired",
    email: null,
    telegramHandle: null,
    telegramUserId: null,
    telegramConnectionStatus: "missing" as const,
    subscriptionId: "sub_3",
    planId: "tradara-pro-monthly" as const,
    planLabel: "Tradara Pro Monthly",
    subscriptionState: "active" as const,
    entitlementState: "active" as const,
    accessState: null,
    currentPeriodEndsAt: "2026-05-01T12:00:00.000Z",
    gracePeriodEndsAt: null,
    updatedAt: "2026-04-18T12:00:00.000Z",
    note: "Billing grants access, but no access record exists yet."
  }
];

describe("admin view models", () => {
  it("derives access metrics for mismatch and pending state visibility", () => {
    expect(getChannelAccessMetrics(rows)).toEqual({
      granted: 1,
      pending: 1,
      mismatched: 1
    });
  });

  it("selects the rows that should appear in the priority queue", () => {
    expect(getPriorityAccessRows(rows).map((row) => row.userId)).toEqual([
      "user_grace",
      "user_expired"
    ]);
  });

  it("calculates the connected Telegram ratio for the users panel", () => {
    expect(getConnectedRatio(rows)).toBe(33);
  });
});
