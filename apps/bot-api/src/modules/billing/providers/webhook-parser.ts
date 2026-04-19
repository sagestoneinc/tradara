import type { BotApiEnv } from "@tradara/shared-config";
import { compareHexSignature, createHmacSha256Hex } from "../../../lib/security";
import { DomainError } from "../../../lib/domain-error";

export interface ParsedWebhookEvent {
  provider: "paypal" | "xendit" | "paymongo";
  eventType: string;
  eventId: string;
  subscriptionId: string;
  status: "paid" | "failed" | "expired" | "pending";
  metadata?: Record<string, unknown>;
  rawPayload: Record<string, unknown>;
}

export class WebhookParser {
  constructor(private readonly env: BotApiEnv) {}

  parseAndVerify(
    provider: string,
    headers: Record<string, string>,
    rawBody: string,
    body: Record<string, unknown>
  ): ParsedWebhookEvent {
    switch (provider) {
      case "paypal":
        return this.parsePayPalWebhook(headers, rawBody, body);
      case "xendit":
        return this.parseXenditWebhook(headers, rawBody, body);
      case "paymongo":
        return this.parsePayMongoWebhook(headers, rawBody, body);
      default:
        throw new DomainError(`Unknown payment provider: ${provider}`, 400, "unknown_provider");
    }
  }

  private parsePayPalWebhook(
    headers: Record<string, string>,
    rawBody: string,
    body: Record<string, unknown>
  ): ParsedWebhookEvent {
    // PayPal webhook verification
    // In production, verify using PayPal's verification API
    // For now, we'll trust the webhook ID from env
    const webhookId = this.env.PAYPAL_WEBHOOK_ID;
    if (!webhookId) {
      throw new DomainError("PayPal webhook verification not configured", 500, "config_error");
    }

    const eventType = body.event_type as string;
    const eventId = body.id as string;

    if (!eventType || !eventId) {
      throw new DomainError("Invalid PayPal webhook payload", 400, "invalid_payload");
    }

    let status: "paid" | "failed" | "expired" | "pending" = "pending";
    let subscriptionId = "";
    let metadata: Record<string, unknown> | undefined;

    // Handle different PayPal event types
    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      const resource = body.resource as Record<string, unknown>;
      status = resource.status === "COMPLETED" ? "paid" : "pending";
      subscriptionId = (resource.id as string) || "";
      if (typeof resource.custom_id === "string" && resource.custom_id.length > 0) {
        metadata = { tradaraUserId: resource.custom_id };
      }
    } else if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      const resource = body.resource as Record<string, unknown>;
      status = (resource.status as string) === "COMPLETED" ? "paid" : "pending";
      const supplementaryData = resource.supplementary_data as Record<string, unknown> | undefined;
      const relatedIds = supplementaryData?.related_ids as unknown;
      if (Array.isArray(relatedIds) && typeof relatedIds[0] === "string") {
        subscriptionId = relatedIds[0];
      }
    } else if (eventType === "PAYMENT.CAPTURE.DENIED") {
      status = "failed";
    }

    return {
      provider: "paypal",
      eventType,
      eventId,
      subscriptionId,
      status,
      metadata,
      rawPayload: body
    };
  }

  private parseXenditWebhook(
    headers: Record<string, string>,
    rawBody: string,
    body: Record<string, unknown>
  ): ParsedWebhookEvent {
    // Verify Xendit signature
    const callbackToken = headers["x-callback-token"];
    if (callbackToken !== this.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN) {
      throw new DomainError("Invalid Xendit webhook signature", 401, "invalid_signature");
    }

    const eventType = body.event as string;
    const data = body.data as Record<string, unknown>;

    if (!eventType || !data) {
      throw new DomainError("Invalid Xendit webhook payload", 400, "invalid_payload");
    }

    let status: "paid" | "failed" | "expired" | "pending" = "pending";
    const subscriptionId = data.external_id as string;
    const metadata = data.metadata as Record<string, unknown> | undefined;

    if (eventType === "invoice.paid") {
      status = "paid";
    } else if (eventType === "invoice.failed") {
      status = "failed";
    } else if (eventType === "invoice.expired") {
      status = "expired";
    }

    return {
      provider: "xendit",
      eventType,
      eventId: data.id as string,
      subscriptionId,
      status,
      metadata,
      rawPayload: body
    };
  }

  private parsePayMongoWebhook(
    headers: Record<string, string>,
    rawBody: string,
    body: Record<string, unknown>
  ): ParsedWebhookEvent {
    // Verify PayMongo signature
    const signatureHeader = headers["paymongo-signature"];
    if (!signatureHeader) {
      throw new DomainError("Missing PayMongo webhook signature", 401, "invalid_signature");
    }

    const parts = this.parsePayMongoSignatureHeader(signatureHeader);
    const expected = createHmacSha256Hex(
      this.env.PAYMONGO_WEBHOOK_SECRET,
      `${parts.timestamp}.${rawBody}`
    );

    const paymongoData = body.data as Record<string, unknown> | undefined;
    const paymongoAttributes = paymongoData?.attributes as Record<string, unknown> | undefined;
    const isLiveMode = paymongoAttributes?.livemode === true;
    const provided = isLiveMode ? parts.liveSignature : parts.testSignature;

    if (!compareHexSignature(provided, expected)) {
      throw new DomainError("PayMongo webhook signature verification failed", 401, "invalid_signature");
    }

    const attributes = paymongoAttributes as Record<string, unknown>;
    const eventType = attributes.type as string;
    const resource = attributes.data as Record<string, unknown>;

    if (!eventType || !resource) {
      throw new DomainError("Invalid PayMongo webhook payload", 400, "invalid_payload");
    }

    let status: "paid" | "failed" | "expired" | "pending" = "pending";
    let subscriptionId = "";
    let metadata: Record<string, unknown> | undefined;

    if (eventType.includes("paid")) {
      status = "paid";
    } else if (eventType.includes("failed")) {
      status = "failed";
    }

    const resourceMetadata = (resource.attributes as Record<string, unknown>)?.metadata as Record<string, unknown>;
    if (resourceMetadata) {
      subscriptionId = (resourceMetadata.tradaraSubscriptionId as string) || 
                      (resourceMetadata.subscriptionId as string) || "";
      metadata = resourceMetadata;
    }

    return {
      provider: "paymongo",
      eventType,
      eventId: (body.data as Record<string, unknown>)?.id as string,
      subscriptionId,
      status,
      metadata,
      rawPayload: body
    };
  }

  private parsePayMongoSignatureHeader(header: string): {
    timestamp: string;
    testSignature: string;
    liveSignature: string;
  } {
    const entries = Object.fromEntries(
      header.split(",").map((part) => {
        const [key, value] = part.split("=");
        return [key?.trim() ?? "", value?.trim() ?? ""];
      })
    );

    if (!entries.t || (!entries.te && !entries.li)) {
      throw new DomainError("Malformed PayMongo webhook signature", 401, "invalid_signature");
    }

    return {
      timestamp: entries.t,
      testSignature: entries.te ?? "",
      liveSignature: entries.li ?? ""
    };
  }
}
