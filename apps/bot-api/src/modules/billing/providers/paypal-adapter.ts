import type { BotApiEnv } from "@tradara/shared-config";
import { subscriptionPlans } from "@tradara/shared-config";
import type { SubscriptionPlanId } from "@tradara/shared-types";
import { DomainError } from "../../../lib/domain-error";
import { BasePaymentAdapter, type PaymentCheckoutRequest, type PaymentCheckoutResponse } from "./provider-adapter";

interface PayPalOrderResponse {
  id: string;
  status: string;
  links: Array<{
    rel: string;
    href: string;
  }>;
}

interface PayPalAuthToken {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
}

export class PayPalAdapter extends BasePaymentAdapter {
  readonly name = "paypal" as const;
  private baseUrl: string;
  private cachedToken: { token: string; expiresAt: number } | null = null;

  constructor(env: BotApiEnv) {
    super(env);
    this.baseUrl = env.PAYPAL_MODE === "sandbox" 
      ? "https://api.sandbox.paypal.com"
      : "https://api.paypal.com";
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

      const token = await this.getAccessToken();
      const metadata = this.createMetadata(request, subscriptionId);

      const createOrderResponse = await fetch(`${this.baseUrl}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          intent: "CAPTURE",
          purchase_units: [
            {
              reference_id: subscriptionId,
              description: `${plan.label} Subscription`,
              custom_id: metadata.tradaraUserId,
              amount: {
                currency_code: "PHP",
                value: String(plan.amountPhp / 100) // PayPal expects decimal amounts
              }
            }
          ],
          payer: request.email ? { email_address: request.email } : undefined,
          application_context: {
            return_url: request.successUrl || `${this.env.BOT_API_BASE_URL}/checkout/success`,
            cancel_url: request.cancelUrl || `${this.env.BOT_API_BASE_URL}/checkout/cancel`,
            brand_name: "Tradara by SageStone Lab",
            locale: "en-US",
            user_action: "PAY_NOW"
          }
        })
      });

      if (!createOrderResponse.ok) {
        const error = await createOrderResponse.json();
        throw new DomainError(
          `PayPal API error: ${error.message}`,
          createOrderResponse.status,
          "paypal_api_error"
        );
      }

      const order = (await createOrderResponse.json()) as PayPalOrderResponse;

      // Find the approval link
      const approvalLink = order.links.find(link => link.rel === "approve");
      if (!approvalLink) {
        throw new DomainError(
          "No approval link in PayPal response",
          500,
          "missing_approval_link"
        );
      }

      return {
        provider: "paypal",
        checkoutUrl: approvalLink.href,
        providerCheckoutSessionId: order.id,
        metadata
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new DomainError(
        `PayPal checkout creation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        500,
        "paypal_checkout_failed"
      );
    }
  }

  private async getAccessToken(): Promise<string> {
    // Return cached token if still valid
    if (this.cachedToken && this.cachedToken.expiresAt > Date.now()) {
      return this.cachedToken.token;
    }

    const authString = Buffer.from(
      `${this.env.PAYPAL_CLIENT_ID}:${this.env.PAYPAL_CLIENT_SECRET}`
    ).toString("base64");

    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        "Authorization": `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: "grant_type=client_credentials"
    });

    if (!response.ok) {
      throw new DomainError(
        "Failed to obtain PayPal access token",
        response.status,
        "paypal_auth_failed"
      );
    }

    const data = (await response.json()) as PayPalAuthToken;
    const expiresAt = Date.now() + (data.expires_in - 60) * 1000; // Refresh 60s before expiry

    this.cachedToken = {
      token: data.access_token,
      expiresAt
    };

    return data.access_token;
  }
}
