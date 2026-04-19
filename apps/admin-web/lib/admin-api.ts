import {
  adminAuditLogListDataSchema,
  adminChannelAccessDataSchema,
  adminDiagnosticsDataSchema,
  adminMarketInsightsListDataSchema,
  adminOverviewDataSchema,
  adminSignalListDataSchema,
  adminSubscriptionsDataSchema,
  adminUsersDataSchema,
  adminWebhookEventsDataSchema
} from "@tradara/shared-types";
import { loadAdminWebEnv } from "@tradara/shared-config";

function getEnv() {
  return loadAdminWebEnv(process.env);
}

async function fetchAdminData<TOutput>(
  path: string,
  schema: { parse(input: unknown): TOutput }
): Promise<TOutput> {
  const env = getEnv();
  const response = await fetch(new URL(path, env.BOT_API_BASE_URL), {
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Failed to load admin data from ${path}: ${response.status}`);
  }

  const payload = await response.json();
  const envelope = payload as {
    success?: boolean;
    data?: unknown;
  };

  if (!envelope.success) {
    throw new Error(`Admin API returned a non-success envelope for ${path}`);
  }

  return schema.parse(envelope.data);
}

export function getAdminOverviewData() {
  return fetchAdminData("/v1/admin/overview", adminOverviewDataSchema);
}

export function getAdminUsersData() {
  return fetchAdminData("/v1/admin/users", adminUsersDataSchema);
}

export function getAdminSubscriptionsData() {
  return fetchAdminData("/v1/admin/subscriptions", adminSubscriptionsDataSchema);
}

export function getAdminChannelAccessData() {
  return fetchAdminData("/v1/admin/channel-access", adminChannelAccessDataSchema);
}

export function getAdminWebhookEventsData() {
  return fetchAdminData("/v1/admin/webhook-events", adminWebhookEventsDataSchema);
}

export function getAdminDiagnosticsData() {
  return fetchAdminData("/v1/admin/diagnostics", adminDiagnosticsDataSchema);
}

export function getAdminAuditLogData() {
  return fetchAdminData("/v1/admin/audit-logs", adminAuditLogListDataSchema);
}

export function getAdminSignalReviewQueueData() {
  return fetchAdminData("/v1/admin/signals/review-queue", adminSignalListDataSchema);
}

export function getAdminPublishedSignalsData() {
  return fetchAdminData("/v1/admin/signals/published", adminSignalListDataSchema);
}

export function getAdminRejectedSignalsData() {
  return fetchAdminData("/v1/admin/signals/rejected", adminSignalListDataSchema);
}

export function getAdminSignalWatchlistData() {
  return fetchAdminData("/v1/admin/signals/watchlist", adminSignalListDataSchema);
}

export function getAdminMarketInsightsData() {
  return fetchAdminData("/v1/admin/signals/market-insights", adminMarketInsightsListDataSchema);
}
