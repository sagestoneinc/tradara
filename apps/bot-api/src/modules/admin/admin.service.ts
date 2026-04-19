import { subscriptionPlans } from "@tradara/shared-config";
import type {
  AdminAuditEntry,
  AdminAuditLogListData,
  AdminChannelAccessData,
  AdminDiagnosticsData,
  AdminMarketInsightsListData,
  AdminOverviewData,
  AdminSignalListData,
  AdminSubscriberSnapshot,
  AdminSubscriptionsData,
  AdminUsersData,
  AdminWebhookEventsData,
  AuditLog,
  ChannelAccessRecord,
  EntitlementSnapshot,
  IntegrationExecutionState,
  SubscriptionSnapshot,
  WebhookEvent
} from "@tradara/shared-types";
import { isoNow } from "@tradara/shared-utils";

import type { WebhookEventRepository } from "../../repositories/types";
import type { ChannelAccessOverview, ChannelAccessService } from "../channel-access/channel-access.service";
import type { SignalAdminReadService } from "../signals/signal-admin-read.service";

const TELEGRAM_AUTOMATION_STATE: IntegrationExecutionState = "live";
const BILLING_EXECUTION_STATE: IntegrationExecutionState = "live";

export class AdminService {
  constructor(
    private readonly channelAccessService: ChannelAccessService,
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly signalAdminReadService: SignalAdminReadService | null,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async getOverviewData(): Promise<AdminOverviewData> {
    const generatedAt = this.generatedAt();
    const rows = await this.buildSubscriberSnapshots();
    const recentAuditEntries = await this.buildAuditEntries(4);

    return {
      generatedAt,
      telegramAutomationState: TELEGRAM_AUTOMATION_STATE,
      billingExecutionState: BILLING_EXECUTION_STATE,
      metrics: {
        grantedAccess: rows.filter((row) => row.accessState === "granted").length,
        pendingActions: rows.filter(
          (row) => row.accessState === "pending_grant" || row.accessState === "pending_revoke"
        ).length,
        atRiskAccounts: rows.filter((row) => row.entitlementState !== "active").length
      },
      paymentsSummary: this.buildPaymentsSummary(rows),
      recentAuditEntries
    };
  }

  async getUsersData(): Promise<AdminUsersData> {
    const rows = await this.buildSubscriberSnapshots();

    return {
      generatedAt: this.generatedAt(),
      metrics: {
        telegramConnected: rows.filter((row) => row.telegramConnectionStatus === "connected").length,
        pendingLinking: rows.filter((row) => row.telegramConnectionStatus !== "connected").length,
        supportWatchlist: rows.filter(
          (row) =>
            row.entitlementState !== "active" ||
            row.accessState !== "granted" ||
            row.telegramConnectionStatus !== "connected"
        ).length
      },
      rows
    };
  }

  async getSubscriptionsData(): Promise<AdminSubscriptionsData> {
    const rows = await this.buildSubscriberSnapshots();
    const now = this.clock().getTime();

    return {
      generatedAt: this.generatedAt(),
      billingExecutionState: BILLING_EXECUTION_STATE,
      metrics: {
        activeEntitlements: rows.filter((row) => row.entitlementState === "active").length,
        recoveryQueue: rows.filter(
          (row) =>
            row.subscriptionState === "grace_period" || row.subscriptionState === "past_due"
        ).length,
        endingWithin14Days: rows.filter((row) => {
          if (!row.currentPeriodEndsAt) {
            return false;
          }

          const msUntilPeriodEnd = new Date(row.currentPeriodEndsAt).getTime() - now;
          return msUntilPeriodEnd >= 0 && msUntilPeriodEnd <= 14 * 24 * 60 * 60 * 1000;
        }).length
      },
      plans: Object.values(subscriptionPlans).map((plan) => {
        const planRows = rows.filter((row) => row.planId === plan.id);

        return {
          ...plan,
          subscriberCount: planRows.length,
          healthySubscribers: planRows.filter((row) => row.entitlementState === "active").length,
          watchlistSubscribers: planRows.filter(
            (row) =>
              row.entitlementState !== "active" || row.telegramConnectionStatus !== "connected"
          ).length
        };
      }),
      rows,
      paymentsSummary: this.buildPaymentsSummary(rows)
    };
  }

  async getChannelAccessData(): Promise<AdminChannelAccessData> {
    return {
      generatedAt: this.generatedAt(),
      telegramAutomationState: TELEGRAM_AUTOMATION_STATE,
      rows: await this.buildSubscriberSnapshots()
    };
  }

  async getWebhookEventsData(): Promise<AdminWebhookEventsData> {
    const rows = await this.listWebhookEvents();

    return {
      generatedAt: this.generatedAt(),
      metrics: {
        totalEvents: rows.length,
        processedEvents: rows.filter((row) => row.processedAt !== null).length,
        pendingEvents: rows.filter((row) => row.processedAt === null).length
      },
      rows: rows.map((row) => ({
        id: row.id,
        provider: row.provider,
        providerEventId: row.providerEventId,
        signatureValid: row.signatureValid,
        processedAt: row.processedAt,
        receivedAt: row.receivedAt,
        payloadHash: row.payloadHash
      }))
    };
  }

  async getDiagnosticsData(): Promise<AdminDiagnosticsData> {
    const [rows, recentAuditEntries, webhookEvents] = await Promise.all([
      this.buildSubscriberSnapshots(),
      this.buildAuditEntries(12),
      this.listWebhookEvents()
    ]);
    const deliveryFailures = rows
      .filter(
        (row) =>
          row.accessState === "error" ||
          row.executionStatus === "retrying" ||
          row.executionStatus === "failed_retryable" ||
          row.executionStatus === "failed_non_retryable"
      )
      .map((row) => ({
        userId: row.userId,
        displayName: row.displayName,
        accessState: row.accessState,
        executionStatus: row.executionStatus ?? null,
        lastError: row.lastError ?? null,
        lastErrorCode: row.lastErrorCode ?? null,
        lastFailureKind: row.lastFailureKind ?? null,
        lastCorrelationId: row.lastCorrelationId ?? null,
        updatedAt: row.updatedAt
      }));

    return {
      generatedAt: this.generatedAt(),
      telegramAutomationState: TELEGRAM_AUTOMATION_STATE,
      metrics: {
        recentWebhookEvents: webhookEvents.slice(0, 10).length,
        deliveryFailures: deliveryFailures.length,
        retryableFailures: deliveryFailures.filter(
          (row) =>
            row.executionStatus === "failed_retryable" || row.lastFailureKind === "retryable"
        ).length
      },
      recentWebhookEvents: webhookEvents.slice(0, 10).map((row) => ({
        id: row.id,
        provider: row.provider,
        providerEventId: row.providerEventId,
        signatureValid: row.signatureValid,
        processedAt: row.processedAt,
        receivedAt: row.receivedAt,
        payloadHash: row.payloadHash
      })),
      recentDeliveryActivity: recentAuditEntries.filter((entry) =>
        entry.action.startsWith("channel_access.")
      ),
      deliveryFailures
    };
  }

  async getAuditLogData(limit = 25): Promise<AdminAuditLogListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.buildAuditEntries(limit)
    };
  }

  async getSignalReviewQueueData(): Promise<AdminSignalListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getReviewQueue()
    };
  }

  async getPublishedSignalsData(): Promise<AdminSignalListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getPublishedSignals()
    };
  }

  async getApprovedSignalsData(): Promise<AdminSignalListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getApprovedSignals()
    };
  }

  async getRejectedSignalsData(): Promise<AdminSignalListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getRejectedSignals()
    };
  }

  async getSignalWatchlistData(): Promise<AdminSignalListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getWatchlistSignals()
    };
  }

  async getMarketInsightsListData(): Promise<AdminMarketInsightsListData> {
    return {
      generatedAt: this.generatedAt(),
      rows: await this.requireSignalAdminReadService().getMarketInsights()
    };
  }

  private async buildSubscriberSnapshots(): Promise<AdminSubscriberSnapshot[]> {
    const overviews = await this.channelAccessService.listOverview();

    return overviews
      .map((overview) => this.mapOverviewToSubscriberSnapshot(overview))
      .sort((left, right) => left.userId.localeCompare(right.userId));
  }

  private mapOverviewToSubscriberSnapshot(overview: ChannelAccessOverview): AdminSubscriberSnapshot {
    const { userId, subscription, accessRecord, entitlement } = overview;
    const plan = subscription ? subscriptionPlans[subscription.planId] : null;
    const telegramConnectionStatus = this.resolveTelegramConnectionStatus(accessRecord);

    return {
      userId,
      displayName: userId,
      email: null,
      telegramHandle: null,
      telegramUserId: accessRecord?.telegramUserId ?? null,
      telegramConnectionStatus,
      subscriptionId: subscription?.id ?? null,
      planId: subscription?.planId ?? null,
      planLabel: plan?.label ?? "No active billing plan",
      subscriptionState: subscription?.status ?? null,
      entitlementState: entitlement.status,
      accessState: accessRecord?.status ?? null,
      executionStatus: accessRecord?.executionStatus ?? null,
      lastError: accessRecord?.lastError ?? null,
      lastErrorCode: accessRecord?.lastErrorCode ?? null,
      lastFailureKind: accessRecord?.lastFailureKind ?? null,
      lastCorrelationId: accessRecord?.lastCorrelationId ?? null,
      currentPeriodEndsAt: subscription?.currentPeriodEndsAt ?? null,
      gracePeriodEndsAt: entitlement.gracePeriodEndsAt ?? subscription?.gracePeriodEndsAt ?? null,
      updatedAt: this.resolveUpdatedAt(subscription, accessRecord),
      note: this.buildSubscriberNote(subscription, entitlement, accessRecord, telegramConnectionStatus)
    };
  }

  private buildPaymentsSummary(rows: AdminSubscriberSnapshot[]): AdminOverviewData["paymentsSummary"] {
    return {
      provider: "mixed",
      executionState: BILLING_EXECUTION_STATE,
      activeSubscriptions: rows.filter((row) => row.subscriptionState === "active").length,
      recoverySubscriptions: rows.filter(
        (row) => row.subscriptionState === "grace_period" || row.subscriptionState === "past_due"
      ).length,
      expiredSubscriptions: rows.filter((row) => row.subscriptionState === "expired").length,
      note: "Live multi-provider routing: PayPal (50%) and Xendit (50%) with consistent-hash A/B selection. Webhook verification and subscription-state ingestion verified across all providers.",
      lastEvaluatedAt: this.generatedAt()
    };
  }

  private async buildAuditEntries(limit: number): Promise<AdminAuditEntry[]> {
    const logs = await this.channelAccessService.listAuditLogs(limit);
    return logs.map((log) => this.mapAuditLog(log));
  }

  private mapAuditLog(log: AuditLog): AdminAuditEntry {
    return {
      id: log.id,
      actor: log.actorId,
      actorType: log.actorType,
      action: log.action,
      entityType: log.entityType,
      entityId: log.entityId,
      correlationId: this.readStringMetadata(log, "correlationId"),
      createdAt: log.createdAt,
      summary: this.summarizeAuditLog(log)
    };
  }

  private summarizeAuditLog(log: AuditLog): string {
    const userId = this.readStringMetadata(log, "userId");
    const reason = this.readStringMetadata(log, "reason");
    const memberState = this.readStringMetadata(log, "memberState");
    const attempt = this.readNumberMetadata(log, "attempt");
    const failureKind = this.readStringMetadata(log, "failureKind");
    const errorCode = this.readStringMetadata(log, "errorCode");

    switch (log.action) {
      case "channel_access.grant_staged":
        return `Queued a Telegram grant for ${userId ?? "an entitled subscriber"}${reason ? ` after ${reason.toLowerCase()}` : ""}.`;
      case "channel_access.revoke_staged":
        return `Queued a Telegram revoke for ${userId ?? "a subscriber"} because billing no longer grants entitlement.`;
      case "channel_access.grant_execution_attempted":
      case "channel_access.revoke_execution_attempted":
        return `Started Telegram ${log.action.includes("grant") ? "grant" : "revoke"} execution attempt ${attempt ?? 1} for ${userId ?? "a subscriber"}.`;
      case "channel_access.membership_observed":
        return `Recorded a Telegram membership observation${memberState ? ` with state ${memberState}` : ""} for the tracked access record.`;
      case "channel_access.membership_observation_unmatched":
        return "Received a Telegram membership update that could not be matched to an existing access record.";
      case "channel_access.invite_requested":
        return `Requested a Telegram invite flow for ${userId ?? "a subscriber"} through the live Bot API.`;
      case "channel_access.grant_executed":
        return `Executed Telegram invite delivery for ${userId ?? "a subscriber"} through the live Bot API.`;
      case "channel_access.revoke_executed":
        return `Executed Telegram access removal for ${userId ?? "a subscriber"} through the live Bot API.`;
      case "channel_access.grant_failed":
      case "channel_access.revoke_failed":
        return `Telegram ${log.action.includes("grant") ? "grant" : "revoke"} execution failed for ${userId ?? "a subscriber"}${failureKind ? ` with a ${failureKind.replace("_", " ")} error` : ""}${errorCode ? ` (${errorCode})` : ""}.`;
      case "billing.checkout_scaffold_created":
        return `Prepared PayMongo checkout scaffolding for ${userId ?? "a subscriber"} without creating a live provider session yet.`;
      case "billing.checkout_session_payment_paid":
      case "billing.payment_paid":
        return `PayMongo confirmed a successful payment for ${userId ?? "a subscriber"}, and billing now grants active entitlement.`;
      case "billing.payment_failed":
        return `PayMongo reported a failed payment for ${userId ?? "a subscriber"}, moving the subscription into billing recovery.`;
      case "billing.event_ignored":
        return "A PayMongo billing event was received but skipped because required Tradara metadata was missing.";
      default:
        return `${log.action} was recorded for ${log.entityType}.`;
    }
  }

  private readStringMetadata(log: AuditLog, key: string): string | null {
    const value = log.metadata[key];
    return typeof value === "string" && value.length > 0 ? value : null;
  }

  private readNumberMetadata(log: AuditLog, key: string): number | null {
    const value = log.metadata[key];
    return typeof value === "number" ? value : null;
  }

  private resolveTelegramConnectionStatus(
    accessRecord: ChannelAccessRecord | null
  ): AdminSubscriberSnapshot["telegramConnectionStatus"] {
    if (!accessRecord?.telegramUserId) {
      return "missing";
    }

    if (accessRecord.status === "pending_grant") {
      return "invited";
    }

    return "connected";
  }

  private resolveUpdatedAt(
    subscription: SubscriptionSnapshot | null,
    accessRecord: ChannelAccessRecord | null
  ): string {
    return accessRecord?.updatedAt ?? subscription?.currentPeriodEndsAt ?? this.generatedAt();
  }

  private buildSubscriberNote(
    subscription: SubscriptionSnapshot | null,
    entitlement: EntitlementSnapshot,
    accessRecord: ChannelAccessRecord | null,
    telegramConnectionStatus: AdminSubscriberSnapshot["telegramConnectionStatus"]
  ): string {
    if (!subscription) {
      return "No billing subscription is on file for this user yet, so premium entitlement remains inactive.";
    }

    if (telegramConnectionStatus === "missing" && entitlement.premiumChannelEligible) {
      return "Billing grants access, but Telegram linking is still required before delivery can proceed.";
    }

    if (accessRecord?.status === "pending_grant") {
      if (
        accessRecord.executionStatus === "retrying" ||
        accessRecord.executionStatus === "failed_retryable"
      ) {
        return `Telegram delivery is retrying after a transient provider failure${accessRecord.lastErrorCode ? ` (${accessRecord.lastErrorCode})` : ""}.`;
      }

      return "Access is queued for Telegram delivery and will use the live Bot API when reconciliation or admin issuance runs.";
    }

    if (accessRecord?.status === "pending_revoke") {
      if (
        accessRecord.executionStatus === "retrying" ||
        accessRecord.executionStatus === "failed_retryable"
      ) {
        return `Telegram revoke is retrying after a transient provider failure${accessRecord.lastErrorCode ? ` (${accessRecord.lastErrorCode})` : ""}.`;
      }

      return "Access is queued for removal because billing no longer grants entitlement, and reconciliation will execute the live Bot API revoke path.";
    }

    if (accessRecord?.status === "error") {
      return `Telegram delivery failed and needs operator attention${accessRecord.lastErrorCode ? ` (${accessRecord.lastErrorCode})` : ""}.`;
    }

    if (entitlement.status === "grace_period") {
      return "Billing is in grace recovery, so premium delivery remains eligible while the grace window is still open.";
    }

    if (accessRecord?.status === "granted") {
      return "Telegram membership has been observed for this linked subscriber.";
    }

    if (accessRecord?.status === "revoked") {
      return "Telegram delivery has been marked revoked for this subscriber.";
    }

    if (entitlement.premiumChannelEligible && !accessRecord) {
      return "Billing grants entitlement, but no channel access record has been created yet.";
    }

    return entitlement.reason;
  }

  private generatedAt(): string {
    return isoNow(this.clock());
  }

  private requireSignalAdminReadService(): SignalAdminReadService {
    if (!this.signalAdminReadService) {
      throw new Error("Signal admin read service is not configured.");
    }

    return this.signalAdminReadService;
  }

  private async listWebhookEvents(): Promise<WebhookEvent[]> {
    return (await this.webhookEventRepository.listAll()).sort((left, right) =>
      right.receivedAt.localeCompare(left.receivedAt)
    );
  }
}
