import type { BotApiEnv } from "@tradara/shared-config";
import { compareHexSignature, createHmacSha256Hex } from "../../../lib/security";
import { DomainError } from "../../../lib/domain-error";
import { decodePayPalCustomId } from "./paypal-metadata";

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
    const resource = (body.resource ?? {}) as Record<string, unknown>;
    const decodedMetadata = this.extractPayPalMetadata(resource);

    // Handle different PayPal event types
    if (eventType === "CHECKOUT.ORDER.COMPLETED") {
      status = resource.status === "COMPLETED" ? "paid" : "pending";
      subscriptionId = this.extractPayPalSubscriptionId(resource, decodedMetadata) ?? "";
      metadata = decodedMetadata;
    } else if (eventType === "PAYMENT.CAPTURE.COMPLETED") {
      status = (resource.status as string) === "COMPLETED" ? "paid" : "pending";
      subscriptionId = this.extractPayPalSubscriptionId(resource, decodedMetadata) ?? "";
      metadata = decodedMetadata;
    } else if (eventType === "PAYMENT.CAPTURE.DENIED") {
      status = "failed";
      subscriptionId = this.extractPayPalSubscriptionId(resource, decodedMetadata) ?? "";
      metadata = decodedMetadata;
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
    if (callbackToken !== this.env.XENDIT_WEBHOOK_TOKEN) {
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

  private extractPayPalMetadata(
    resource: Record<string, unknown>
  ): Record<string, unknown> | undefined {
    const directCustomId = this.decodePayPalMetadataValue(resource.custom_id);
    if (directCustomId) {
      return directCustomId;
    }

    const purchaseUnits = resource.purchase_units;
    if (Array.isArray(purchaseUnits)) {
      for (const purchaseUnit of purchaseUnits) {
        if (purchaseUnit && typeof purchaseUnit === "object") {
          const customId = this.decodePayPalMetadataValue(
            (purchaseUnit as Record<string, unknown>).custom_id
          );

          if (customId) {
            return customId;
          }
        }
      }
    }

    return undefined;
  }

  private decodePayPalMetadataValue(value: unknown): Record<string, unknown> | undefined {
    if (typeof value !== "string" || value.length === 0) {
      return undefined;
    }

    return decodePayPalCustomId(value);
  }

  private extractPayPalSubscriptionId(
    resource: Record<string, unknown>,
    metadata?: Record<string, unknown>
  ): string | undefined {
    if (typeof metadata?.tradaraSubscriptionId === "string") {
      return metadata.tradaraSubscriptionId;
    }

    const purchaseUnits = resource.purchase_units;
    if (Array.isArray(purchaseUnits)) {
      for (const purchaseUnit of purchaseUnits) {
        if (purchaseUnit && typeof purchaseUnit === "object") {
          const referenceId = (purchaseUnit as Record<string, unknown>).reference_id;
          if (typeof referenceId === "string" && referenceId.length > 0) {
            return referenceId;
          }
        }
      }
    }

    if (typeof resource.id === "string" && resource.id.length > 0) {
      return resource.id;
    }

    return undefined;
  }
}
