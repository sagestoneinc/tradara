import type { BotApiEnv } from "@tradara/shared-config";
import type { SubscriptionPlanId } from "@tradara/shared-types";

export interface PaymentCheckoutRequest {
  userId: string;
  planId: SubscriptionPlanId;
  email?: string | null;
  successUrl?: string | null;
  cancelUrl?: string | null;
}

export interface PaymentCheckoutResponse {
  provider: "paypal" | "xendit" | "paymongo";
  checkoutUrl: string;
  providerCheckoutSessionId: string;
  metadata: {
    tradaraUserId: string;
    tradaraPlanId: SubscriptionPlanId;
    tradaraSubscriptionId: string;
  };
}

export interface PaymentProvider {
  readonly name: "paypal" | "xendit" | "paymongo";
  createCheckoutSession(
    request: PaymentCheckoutRequest,
    subscriptionId: string
  ): Promise<PaymentCheckoutResponse>;
}

export abstract class BasePaymentAdapter implements PaymentProvider {
  abstract readonly name: "paypal" | "xendit" | "paymongo";

  protected constructor(protected readonly env: BotApiEnv) {}

  abstract createCheckoutSession(
    request: PaymentCheckoutRequest,
    subscriptionId: string
  ): Promise<PaymentCheckoutResponse>;

  protected createMetadata(request: PaymentCheckoutRequest, subscriptionId: string) {
    return {
      tradaraUserId: request.userId,
      tradaraPlanId: request.planId,
      tradaraSubscriptionId: subscriptionId
    };
  }
}
