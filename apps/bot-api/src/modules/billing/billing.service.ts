import type { BotApiEnv } from "@tradara/shared-config";
import { accessPolicy, subscriptionPlans } from "@tradara/shared-config";
import type {
  AuditLog,
  BillingCheckoutSessionScaffold,
  CreateBillingCheckoutSessionRequest,
  PaymentEventType,
  SubscriptionSnapshot,
  WebhookEvent
} from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import { hashPayload } from "../../lib/security";
import type {
  AuditLogRepository,
  SubscriptionRepository,
  WebhookEventRepository
} from "../../repositories/types";
import type { PaymentProvider } from "./providers/provider-adapter";
import { ProviderRouter } from "./providers/provider-router";
import { WebhookParser, type ParsedWebhookEvent } from "./providers/webhook-parser";

interface BillingTransitionResult {
  eventType: PaymentEventType;
  duplicate: boolean;
  subscription: SubscriptionSnapshot | null;
  stateChanged: boolean;
}

export class BillingService {
  private readonly router: ProviderRouter;
  private readonly webhookParser: WebhookParser;

  constructor(
    private readonly env: BotApiEnv,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly auditLogRepository: AuditLogRepository,
    providers: Map<string, PaymentProvider>,
    private readonly clock: () => Date = () => new Date()
  ) {
    this.router = ProviderRouter.fromEnv(env, providers);
    this.webhookParser = new WebhookParser(env);
  }

  async createCheckoutSession(
    request: CreateBillingCheckoutSessionRequest
  ): Promise<BillingCheckoutSessionScaffold> {
    const subscriptionId = createId("sub");
    const provider = this.router.selectProvider(request.userId);

    try {
      const session = await provider.createCheckoutSession(request, subscriptionId);

      await this.appendAuditLog({
        actorType: "system",
        actorId: `billing-checkout-${provider.name}`,
        action: "billing.checkout_session_created",
        entityType: "billing_checkout",
        entityId: subscriptionId,
        metadata: {
          userId: request.userId,
          planId: request.planId,
          provider: provider.name,
          providerSessionId: session.providerCheckoutSessionId
        }
      });

      return {
        executionState: "live",
        provider: provider.name,
        userId: request.userId,
        planId: request.planId,
        checkoutUrl: session.checkoutUrl,
        providerCheckoutSessionId: session.providerCheckoutSessionId,
        metadata: session.metadata,
        note: `Checkout session created with ${provider.name}`
      };
    } catch (err) {
      await this.appendAuditLog({
        actorType: "system",
        actorId: `billing-checkout-${provider.name}`,
        action: "billing.checkout_session_failed",
        entityType: "billing_checkout",
        entityId: subscriptionId,
        metadata: {
          userId: request.userId,
          planId: request.planId,
          provider: provider.name,
          error: err instanceof Error ? err.message : "Unknown error"
        }
      });

      if (err instanceof DomainError) throw err;
      throw new DomainError(
        `Checkout creation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        500,
        "checkout_failed"
      );
    }
  }

  async handleWebhook(input: {
    provider: string;
    headers: Record<string, string>;
    rawBody: string;
    payload: Record<string, unknown>;
  }): Promise<BillingTransitionResult> {
    if (!input.rawBody) {
      throw new DomainError(
        "Raw request body is required for webhook verification.",
        400,
        "missing_raw_body"
      );
    }

    // Parse and verify webhook
    const parsedEvent = this.webhookParser.parseAndVerify(
      input.provider,
      input.headers,
      input.rawBody,
      input.payload
    );

    // Record webhook event for idempotency
    const recorded = await this.webhookEventRepository.recordIncoming({
      id: createId("wh"),
      provider: (input.provider as any),
      providerEventId: parsedEvent.eventId,
      signatureValid: true,
      payloadHash: hashPayload(input.payload),
      processedAt: null,
      receivedAt: isoNow(this.clock())
    });

    if (recorded.duplicate) {
      return {
        eventType: (parsedEvent.eventType as PaymentEventType),
        duplicate: true,
        subscription: null,
        stateChanged: false
      };
    }

    // Apply state transition
    const subscription = await this.applyTransition(parsedEvent);
    await this.webhookEventRepository.markProcessed(recorded.event.id, isoNow(this.clock()));

    return {
      eventType: (parsedEvent.eventType as PaymentEventType),
      duplicate: false,
      subscription,
      stateChanged: subscription !== null
    };
  }

  private async applyTransition(event: ParsedWebhookEvent): Promise<SubscriptionSnapshot | null> {
    const { subscriptionId, status, metadata, eventType } = event;

    // Extract Tradara metadata
    const tradaraUserId = (metadata?.tradaraUserId ?? metadata?.userId) as string | undefined;
    const tradaraPlanId = (metadata?.tradaraPlanId ?? metadata?.planId) as string | undefined;
    const tradaraSubscriptionId = (metadata?.tradaraSubscriptionId ?? metadata?.subscriptionId) as string | undefined;

    if (!tradaraUserId || !tradaraPlanId) {
      await this.appendAuditLog({
        actorType: "webhook",
        actorId: event.provider,
        action: "billing.event_ignored",
        entityType: "billing_event",
        entityId: event.eventId,
        metadata: {
          eventType,
          reason: "Missing Tradara metadata for user or plan.",
          provider: event.provider
        }
      });
      return null;
    }

    const existing = await this.subscriptionRepository.findByUserId(tradaraUserId);
    const effectiveSubscriptionId = tradaraSubscriptionId ?? existing?.id ?? createId("sub");
    const effectiveAt = this.clock();
    const periodEnd = this.resolveCurrentPeriodEnd(effectiveAt, tradaraPlanId as any, existing);

    let next: SubscriptionSnapshot;

    switch (status) {
      case "paid":
        next = {
          id: effectiveSubscriptionId,
          userId: tradaraUserId,
          planId: tradaraPlanId as any,
          status: "active",
          providerName: event.provider as any,
          currentPeriodEndsAt: periodEnd,
          gracePeriodEndsAt: null,
          canceledAt: null,
          providerCustomerId: existing?.providerCustomerId ?? null,
          providerSubscriptionId: subscriptionId
        };
        break;
      case "failed":
        next = {
          id: effectiveSubscriptionId,
          userId: tradaraUserId,
          planId: tradaraPlanId as any,
          status: "past_due",
          providerName: event.provider as any,
          currentPeriodEndsAt: existing?.currentPeriodEndsAt ?? effectiveAt.toISOString(),
          gracePeriodEndsAt: this.addHours(effectiveAt, accessPolicy.defaultGracePeriodHours).toISOString(),
          canceledAt: existing?.canceledAt ?? null,
          providerCustomerId: existing?.providerCustomerId ?? null,
          providerSubscriptionId: subscriptionId
        };
        break;
      case "expired":
        next = {
          id: effectiveSubscriptionId,
          userId: tradaraUserId,
          planId: tradaraPlanId as any,
          status: "expired",
          providerName: event.provider as any,
          currentPeriodEndsAt: existing?.currentPeriodEndsAt ?? effectiveAt.toISOString(),
          gracePeriodEndsAt: null,
          canceledAt: effectiveAt.toISOString(),
          providerCustomerId: existing?.providerCustomerId ?? null,
          providerSubscriptionId: subscriptionId
        };
        break;
      default:
        return null;
    }

    await this.subscriptionRepository.save(next);
    await this.appendAuditLog({
      actorType: "webhook",
      actorId: event.provider,
      action: `billing.${eventType.replaceAll(".", "_")}`,
      entityType: "subscription",
      entityId: next.id,
      metadata: {
        userId: next.userId,
        planId: next.planId,
        status: next.status,
        providerEventId: event.eventId,
        provider: event.provider
      }
    });

    return next;
  }

  private resolveCurrentPeriodEnd(
    effectiveAt: Date,
    planId: SubscriptionSnapshot["planId"],
    existing: SubscriptionSnapshot | null
  ): string {
    if (existing?.status === "active" && new Date(existing.currentPeriodEndsAt) > effectiveAt) {
      return existing.currentPeriodEndsAt;
    }

    const monthsToAdd =
      subscriptionPlans[planId].billingInterval === "month"
        ? 1
        : subscriptionPlans[planId].billingInterval === "quarter"
          ? 3
          : 12;

    const periodEnd = new Date(effectiveAt);
    periodEnd.setUTCMonth(periodEnd.getUTCMonth() + monthsToAdd);
    return periodEnd.toISOString();
  }

  private addHours(date: Date, hours: number): Date {
    return new Date(date.getTime() + hours * 60 * 60 * 1000);
  }

  private async appendAuditLog(input: Omit<AuditLog, "id" | "createdAt">): Promise<void> {
    await this.auditLogRepository.append({
      id: createId("audit"),
      createdAt: isoNow(this.clock()),
      ...input
    });
  }
}
