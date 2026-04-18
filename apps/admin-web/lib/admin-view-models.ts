import type { AdminSubscriberSnapshot } from "@tradara/shared-types";

export function getChannelAccessMetrics(rows: AdminSubscriberSnapshot[]) {
  return {
    granted: rows.filter((row) => row.accessState === "granted").length,
    pending: rows.filter(
      (row) => row.accessState === "pending_grant" || row.accessState === "pending_revoke"
    ).length,
    mismatched: rows.filter(
      (row) => row.subscriptionState === "active" && row.accessState !== "granted"
    ).length
  };
}

export function getPriorityAccessRows(
  rows: AdminSubscriberSnapshot[],
  limit = 4
): AdminSubscriberSnapshot[] {
  return rows
    .filter((row) => row.accessState !== "granted" || row.entitlementState !== "active")
    .slice(0, limit);
}

export function getConnectedRatio(rows: AdminSubscriberSnapshot[]): number {
  const connectedUsers = rows.filter((row) => row.telegramConnectionStatus === "connected").length;
  return Math.round((connectedUsers / Math.max(rows.length, 1)) * 100);
}
