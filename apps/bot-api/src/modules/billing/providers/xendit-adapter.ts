import type { BotApiEnv } from "@tradara/shared-config";
import { subscriptionPlans } from "@tradara/shared-config";
import type { SubscriptionPlanId } from "@tradara/shared-types";
import { DomainError } from "../../../lib/domain-error";
import { BasePaymentAdapter, type PaymentCheckoutRequest, type PaymentCheckoutResponse } from "./provider-adapter";

interface XenditInvoiceResponse {
  id: string;
  invoice_url: string;
  status: string;
  external_id: string;
  amount: number;
  currency: string;
  metadata?: Record<string, unknown>;
}

export class XenditAdapter extends BasePaymentAdapter {
  readonly name = "xendit" as const;
  private baseUrl: string;

  constructor(env: BotApiEnv) {
    super(env);
    this.baseUrl = env.XENDIT_MODE === "test"
      ? "https://api.xendit.co"
      : "https://api.xendit.co";
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

      const authString = Buffer.from(`${this.env.XENDIT_SECRET_KEY}:`).toString("base64");

      const createInvoiceResponse = await fetch(`${this.baseUrl}/v2/invoices`, {
        method: "POST",
        headers: {
          "Authorization": `Basic ${authString}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          external_id: subscriptionId,
          amount: plan.amountPhp,
          currency: "PHP",
          description: `${plan.label} Subscription`,
          customer: request.email
            ? {
                email: request.email,
                given_names: "Tradara User",
                surname: request.userId
              }
            : undefined,
          items: [
            {
              name: plan.label,
              quantity: 1,
              price: plan.amountPhp,
              currency: "PHP"
            }
          ],
          fees: [],
          metadata,
          success_redirect_url: request.successUrl || `${this.env.BOT_API_BASE_URL}/checkout/success`,
          failure_redirect_url: request.cancelUrl || `${this.env.BOT_API_BASE_URL}/checkout/cancel`,
          reminder_time: 24, // hours before due date
          invoice_duration: 86400 * 30 // 30 days in seconds
        })
      });

      if (!createInvoiceResponse.ok) {
        const error = await createInvoiceResponse.json();
        throw new DomainError(
          `Xendit API error: ${error.message || JSON.stringify(error)}`,
          createInvoiceResponse.status,
          "xendit_api_error"
        );
      }

      const invoice = (await createInvoiceResponse.json()) as XenditInvoiceResponse;

      return {
        provider: "xendit",
        checkoutUrl: invoice.invoice_url,
        providerCheckoutSessionId: invoice.id,
        metadata
      };
    } catch (err) {
      if (err instanceof DomainError) throw err;
      throw new DomainError(
        `Xendit checkout creation failed: ${err instanceof Error ? err.message : "Unknown error"}`,
        500,
        "xendit_checkout_failed"
      );
    }
  }
}
