import type { BotApiEnv } from "@tradara/shared-config";
import { accessPolicy, subscriptionPlans } from "@tradara/shared-config";
import type {
  AuditLog,
  BillingCheckoutSessionScaffold,
  CreateBillingCheckoutSessionRequest,
  PaymongoEventType,
  SubscriptionSnapshot,
  WebhookEvent
} from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import { compareHexSignature, createHmacSha256Hex, hashPayload } from "../../lib/security";
import type {
  AuditLogRepository,
  SubscriptionRepository,
  WebhookEventRepository
} from "../../repositories/types";
import type { PaymongoWebhookPayload } from "./billing.schemas";

interface PaymongoSignatureParts {
  timestamp: string;
  testSignature: string;
  liveSignature: string;
}

interface BillingTransitionResult {
  eventType: PaymongoEventType;
  duplicate: boolean;
  subscription: SubscriptionSnapshot | null;
  stateChanged: boolean;
}

export class BillingService {
  constructor(
    private readonly env: BotApiEnv,
    private readonly subscriptionRepository: SubscriptionRepository,
    private readonly webhookEventRepository: WebhookEventRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async createCheckoutSessionScaffold(
    request: CreateBillingCheckoutSessionRequest
  ): Promise<BillingCheckoutSessionScaffold> {
    const subscriptionId = createId("sub");

    await this.appendAuditLog({
      actorType: "system",
      actorId: "billing-checkout-scaffold",
      action: "billing.checkout_scaffold_created",
      entityType: "billing_checkout",
      entityId: subscriptionId,
      metadata: {
        userId: request.userId,
        planId: request.planId
      }
    });

    return {
      executionState: "pending",
      provider: "paymongo",
      userId: request.userId,
      planId: request.planId,
      checkoutUrl: null,
      providerCheckoutSessionId: null,
      metadata: {
        tradaraUserId: request.userId,
        tradaraPlanId: request.planId,
        tradaraSubscriptionId: subscriptionId
      },
      note: "PayMongo checkout session creation is scaffolded. Wire a live authenticated Checkout Session API call and pass this metadata through to webhook events."
    };
  }

  async handleWebhook(input: {
    signatureHeader: string | undefined;
    rawBody: string | undefined;
    payload: PaymongoWebhookPayload;
  }): Promise<BillingTransitionResult> {
    const rawBody = input.rawBody;

    if (!rawBody) {
      throw new DomainError(
        "Raw request body is required for PayMongo signature verification.",
        400,
        "missing_raw_body"
      );
    }

    this.verifySignature(input.signatureHeader, rawBody, input.payload);

    const eventType = input.payload.data.attributes.type;
    const recorded = await this.webhookEventRepository.recordIncoming({
      id: createId("wh"),
      provider: "paymongo",
      providerEventId: input.payload.data.id,
      signatureValid: true,
      payloadHash: hashPayload(input.payload),
      processedAt: null,
      receivedAt: isoNow(this.clock())
    });

    if (recorded.duplicate) {
      return {
        eventType,
        duplicate: true,
        subscription: null,
        stateChanged: false
      };
    }

    const subscription = await this.applyTransition(input.payload);
    await this.webhookEventRepository.markProcessed(recorded.event.id, isoNow(this.clock()));

    return {
      eventType,
      duplicate: false,
      subscription,
      stateChanged: subscription !== null
    };
  }

  private verifySignature(
    signatureHeader: string | undefined,
    rawBody: string,
    payload: PaymongoWebhookPayload
  ): void {
    const parts = this.parseSignatureHeader(signatureHeader);
    const expected = createHmacSha256Hex(
      this.env.PAYMONGO_WEBHOOK_SECRET,
      `${parts.timestamp}.${rawBody}`
    );
    const provided = payload.data.attributes.livemode ? parts.liveSignature : parts.testSignature;

    if (!compareHexSignature(provided, expected)) {
      throw new DomainError("PayMongo webhook signature verification failed.", 401, "invalid_signature");
    }
  }

  private parseSignatureHeader(signatureHeader: string | undefined): PaymongoSignatureParts {
    if (!signatureHeader) {
      throw new DomainError("Missing PayMongo webhook signature.", 401, "invalid_signature");
    }

    const entries = Object.fromEntries(
      signatureHeader.split(",").map((part) => {
        const [key, value] = part.split("=");
        return [key?.trim() ?? "", value?.trim() ?? ""];
      })
    );

    if (!entries.t || (!entries.te && !entries.li)) {
      throw new DomainError("Malformed PayMongo webhook signature.", 401, "invalid_signature");
    }

    return {
      timestamp: entries.t,
      testSignature: entries.te ?? "",
      liveSignature: entries.li ?? ""
    };
  }

  private async applyTransition(
    payload: PaymongoWebhookPayload
  ): Promise<SubscriptionSnapshot | null> {
    const eventType = payload.data.attributes.type;
    const resource = payload.data.attributes.data;
    const metadata = this.extractMetadata(payload);
    const effectiveAt = this.resolveEffectiveAt(payload);

    if (!metadata.userId || !metadata.planId) {
      await this.appendAuditLog({
        actorType: "webhook",
        actorId: "paymongo",
        action: "billing.event_ignored",
        entityType: "billing_event",
        entityId: payload.data.id,
        metadata: {
          eventType,
          reason: "Missing Tradara metadata for user or plan."
        }
      });

      return null;
    }

    const existing = await this.subscriptionRepository.findByUserId(metadata.userId);
    const subscriptionId = metadata.subscriptionId ?? existing?.id ?? createId("sub");
    const periodEnd = this.resolveCurrentPeriodEnd(effectiveAt, metadata.planId, existing);

    let next: SubscriptionSnapshot;

    switch (eventType) {
      case "checkout_session.payment.paid":
      case "payment.paid":
        next = {
          id: subscriptionId,
          userId: metadata.userId,
          planId: metadata.planId,
          status: "active",
          providerName: "paymongo",
          currentPeriodEndsAt: periodEnd,
          gracePeriodEndsAt: null,
          canceledAt: null,
          providerCustomerId: existing?.providerCustomerId ?? null,
          providerSubscriptionId:
            resource.type === "checkout_session"
              ? resource.id
              : resource.attributes.payment_intent_id ?? resource.id
        };
        break;
      case "payment.failed":
        next = {
          id: subscriptionId,
          userId: metadata.userId,
          planId: metadata.planId,
          status: "past_due",
          providerName: "paymongo",
          currentPeriodEndsAt: existing?.currentPeriodEndsAt ?? effectiveAt.toISOString(),
          gracePeriodEndsAt: this.addHours(
            effectiveAt,
            accessPolicy.defaultGracePeriodHours
          ).toISOString(),
          canceledAt: existing?.canceledAt ?? null,
          providerCustomerId: existing?.providerCustomerId ?? null,
          providerSubscriptionId:
            resource.type === "checkout_session"
              ? resource.id
              : resource.attributes.payment_intent_id ?? resource.id
        };
        break;
      default:
        return null;
    }

    await this.subscriptionRepository.save(next);
    await this.appendAuditLog({
      actorType: "webhook",
      actorId: "paymongo",
      action: `billing.${eventType.replaceAll(".", "_")}`,
      entityType: "subscription",
      entityId: next.id,
      metadata: {
        userId: next.userId,
        planId: next.planId,
        status: next.status,
        providerEventId: payload.data.id
      }
    });

    return next;
  }

  private extractMetadata(payload: PaymongoWebhookPayload): {
    userId: string | null;
    planId: SubscriptionSnapshot["planId"] | null;
    subscriptionId: string | null;
  } {
    const resource = payload.data.attributes.data;
    const candidates =
      resource.type === "checkout_session"
        ? [
            resource.attributes.metadata,
            resource.attributes.payment_intent?.attributes?.metadata,
            resource.attributes.payments?.[0]?.attributes.metadata
          ]
        : [resource.attributes.metadata];

    for (const candidate of candidates) {
      if (!candidate) {
        continue;
      }

      const userId = candidate.tradaraUserId ?? candidate.userId ?? null;
      const planId = candidate.tradaraPlanId ?? candidate.planId ?? null;
      const subscriptionId =
        candidate.tradaraSubscriptionId ?? candidate.subscriptionId ?? null;

      if (userId && planId) {
        return {
          userId,
          planId,
          subscriptionId
        };
      }
    }

    return {
      userId: null,
      planId: null,
      subscriptionId: null
    };
  }

  private resolveEffectiveAt(payload: PaymongoWebhookPayload): Date {
    const resource = payload.data.attributes.data;

    if (resource.type === "checkout_session") {
      const timestamp =
        resource.attributes.paid_at ??
        resource.attributes.updated_at ??
        resource.attributes.created_at ??
        payload.data.attributes.updated_at ??
        payload.data.attributes.created_at;

      return timestamp ? new Date(timestamp * 1000) : this.clock();
    }

    const timestamp =
      resource.attributes.paid_at ??
      resource.attributes.failed_at ??
      resource.attributes.updated_at ??
      resource.attributes.created_at ??
      payload.data.attributes.updated_at ??
      payload.data.attributes.created_at;

    return timestamp ? new Date(timestamp * 1000) : this.clock();
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
