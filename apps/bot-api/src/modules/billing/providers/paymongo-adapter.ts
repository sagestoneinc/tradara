import type { BotApiEnv } from "@tradara/shared-config";
import { subscriptionPlans } from "@tradara/shared-config";
import type { SubscriptionPlanId } from "@tradara/shared-types";
import { DomainError } from "../../../lib/domain-error";
import { BasePaymentAdapter, type PaymentCheckoutRequest, type PaymentCheckoutResponse } from "./provider-adapter";

interface PayMongoCheckoutSessionResponse {
  data: {
    id: string;
    attributes: {
      checkout_url: string;
      success_url: string;
      cancel_url: string;
      line_items: Array<{
        currency: string;
        amount: number;
        description: string;
      }>;
      payment_method_types: string[];
      metadata?: Record<string, unknown>;
    };
  };
}

export class PayMongoAdapter extends BasePaymentAdapter {
  readonly name = "paymongo" as const;
  private baseUrl = "https://api.paymongo.com";

  constructor(env: BotApiEnv) {
    super(env);
  }

  async createCheckoutSession(
    request: PaymentCheckoutRequest,
    subscriptionId: string
  ): Promise<PaymentCheckoutResponse> {
    try {
      const plan = subscriptionPlans[request.planId as SubscriptionPlanId];
      if (!plan) {
        throw new DomainError(`Invalid plan: ${request.planId}`, 400, "invalid_plan");
      }

      const metadata = this.createMetadata(request, subscriptionId);
      const authString = Buffer.from(`${this.env.PAYMONGO_API_KEY}:`).toString("base64");

      const createCheckoutResponse = await fetch(`${this.baseUrl}/v1/checkout_sessions`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authString}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: {
            attributes: {
              line_items: [
                {
                  currency: "PHP",
                  amount: plan.amountPhp * 100, // PayMongo expects amount in cents
                  description: plan.label,
                  name: plan.label,
                  quantity: 1
                }
              ],
              payment_method_types: ["card", "gcash", "paymaya"],
              success_url: request.successUrl || `${this.env.BOT_API_BASE_URL}/checkout/success`,
              cancel_url: request.cancelUrl || `${this.env.BOT_API_BASE_URL}/checkout/cancel`,
              description: `${plan.label} Subscription`,
              metadata
            }
          }
        })
      });

      if (!createCheckoutResponse.ok) {
        const error = await createCheckoutResponse.json();
        throw new DomainError(
          `PayMongo API error: ${JSON.stringify(error)}`,
          createCheckoutResponse.status,
          "paymongo_api_error"
        );
      }

      const session = (await createCheckoutResponse.json()) as PayMongoCheckoutSessionResponse;

      return {
        provider: "paymongo",
        checkoutUrl: session.data.attributes.checkout_url,
        providerCheckoutSessionId: session.data.id,
        metadata
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new DomainError(
        `PayMongo checkout creation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        500,
        "paymongo_checkout_failed"
      );
    }
  }
}
