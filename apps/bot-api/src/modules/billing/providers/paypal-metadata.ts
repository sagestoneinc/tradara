import type { SubscriptionPlanId } from "@tradara/shared-types";

interface PayPalTradaraMetadata extends Record<string, unknown> {
  tradaraUserId: string;
  tradaraPlanId: SubscriptionPlanId;
  tradaraSubscriptionId: string;
}

const PAYPAL_CUSTOM_ID_PREFIX = "tradara:";

export function encodePayPalCustomId(metadata: PayPalTradaraMetadata): string {
  return `${PAYPAL_CUSTOM_ID_PREFIX}${Buffer.from(JSON.stringify(metadata)).toString("base64url")}`;
}

export function decodePayPalCustomId(customId: string): PayPalTradaraMetadata | undefined {
  if (!customId.startsWith(PAYPAL_CUSTOM_ID_PREFIX)) {
    return undefined;
  }

  const encodedPayload = customId.slice(PAYPAL_CUSTOM_ID_PREFIX.length);

  try {
    const decoded = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as Partial<PayPalTradaraMetadata>;

    if (
      typeof decoded.tradaraUserId !== "string" ||
      typeof decoded.tradaraPlanId !== "string" ||
      typeof decoded.tradaraSubscriptionId !== "string"
    ) {
      return undefined;
    }

    return {
      tradaraUserId: decoded.tradaraUserId,
      tradaraPlanId: decoded.tradaraPlanId as SubscriptionPlanId,
      tradaraSubscriptionId: decoded.tradaraSubscriptionId
    };
  } catch {
    return undefined;
  }
}
