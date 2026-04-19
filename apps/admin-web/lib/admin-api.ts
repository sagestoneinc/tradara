import {
  type AdminChannelAccessData,
  type AdminOverviewData,
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

function fallbackOverviewData(): AdminOverviewData {
  const generatedAt = new Date().toISOString();

  return {
    generatedAt,
    telegramAutomationState: "stubbed",
    billingExecutionState: "stubbed",
    metrics: {
      grantedAccess: 0,
      pendingActions: 0,
      atRiskAccounts: 0
    },
    paymentsSummary: {
      provider: "mixed",
      executionState: "stubbed",
      activeSubscriptions: 0,
      recoverySubscriptions: 0,
      expiredSubscriptions: 0,
      note: "Admin API is temporarily unavailable. Displaying a safe empty-state snapshot.",
      lastEvaluatedAt: generatedAt
    },
    recentAuditEntries: []
  };
}

function fallbackChannelAccessData(): AdminChannelAccessData {
  return {
    generatedAt: new Date().toISOString(),
    telegramAutomationState: "stubbed",
    rows: []
  };
}

async function fetchAdminData<TOutput>(
  path: string,
  schema: { parse(input: unknown): TOutput },
  fallback?: () => TOutput
): Promise<TOutput> {
  const env = getEnv();
  let response: Response;

  try {
    response = await fetch(new URL(path, env.BOT_API_BASE_URL), {
      cache: "no-store"
    });
  } catch (error) {
    if (fallback) {
      console.warn(`Admin API request failed for ${path}; using fallback snapshot.`, error);
      return fallback();
    }

    throw error;
  }

  if (!response.ok) {
    if (fallback) {
      console.warn(
        `Admin API returned ${response.status} for ${path}; using fallback snapshot.`
      );
      return fallback();
    }

    throw new Error(`Failed to load admin data from ${path}: ${response.status}`);
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch (error) {
    if (fallback) {
      console.warn(`Admin API response parsing failed for ${path}; using fallback snapshot.`, error);
      return fallback();
    }

    throw error;
  }

  const envelope = payload as {
    success?: boolean;
    data?: unknown;
  };

  if (!envelope.success) {
    throw new Error(`Admin API returned a non-success envelope for ${path}`);
  }

  try {
    return schema.parse(envelope.data);
  } catch (error) {
    if (fallback) {
      console.warn(`Admin API schema parse failed for ${path}; using fallback snapshot.`, error);
      return fallback();
    }

    throw error;
  }
}

export function getAdminOverviewData() {
  return fetchAdminData("/v1/admin/overview", adminOverviewDataSchema, fallbackOverviewData);
}

export function getAdminUsersData() {
  return fetchAdminData("/v1/admin/users", adminUsersDataSchema);
}

export function getAdminSubscriptionsData() {
  return fetchAdminData("/v1/admin/subscriptions", adminSubscriptionsDataSchema);
}

export function getAdminChannelAccessData() {
  return fetchAdminData(
    "/v1/admin/channel-access",
    adminChannelAccessDataSchema,
    fallbackChannelAccessData
  );
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
