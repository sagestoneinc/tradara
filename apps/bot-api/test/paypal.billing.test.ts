import { describe, expect, it } from "vitest";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import {
  billingTestEnv,
  createPayPalWebhookPayload,
  paypalWebhookHeaders
} from "./helpers/billing-fixtures";

describe("paypal billing", () => {
  it("activates billing state idempotently on a completed webhook", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));
    const rawBody = JSON.stringify(
      createPayPalWebhookPayload({
        eventType: "CHECKOUT.ORDER.COMPLETED",
        eventId: "pp_evt_paid_001",
        userId: "user_pp_paid",
        planId: "tradara-pro-quarterly",
        subscriptionId: "sub_pp_paid_001"
      })
    );
    const headers = paypalWebhookHeaders(rawBody);

    const firstResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paypal",
      headers,
      payload: rawBody
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paypal",
      headers,
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_pp_paid"
    });

    expect(firstResponse.statusCode).toBe(202);
    expect(secondResponse.statusCode).toBe(200);
    expect(overviewResponse.json().data.subscription.status).toBe("active");
    expect(overviewResponse.json().data.subscription.planId).toBe("tradara-pro-quarterly");
    expect(overviewResponse.json().data.entitlement.premiumChannelEligible).toBe(true);
  });

  it("moves billing into recovery on a denied capture webhook", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));
    const rawBody = JSON.stringify(
      createPayPalWebhookPayload({
        eventType: "PAYMENT.CAPTURE.DENIED",
        eventId: "pp_evt_failed_001",
        userId: "user_active",
        planId: "tradara-pro-monthly",
        subscriptionId: "sub_active_001"
      })
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paypal",
      headers: paypalWebhookHeaders(rawBody),
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_active"
    });

    expect(response.statusCode).toBe(202);
    expect(overviewResponse.json().data.subscription.status).toBe("past_due");
    expect(overviewResponse.json().data.subscription.gracePeriodEndsAt).not.toBeNull();
  });

  it("rejects invalid PayPal transmission signatures", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));
    const rawBody = JSON.stringify(
      createPayPalWebhookPayload({
        eventType: "CHECKOUT.ORDER.COMPLETED",
        eventId: "pp_evt_invalid_sig_001",
        userId: "user_pp_invalid_sig",
        planId: "tradara-pro-monthly",
        subscriptionId: "sub_pp_invalid_sig_001"
      })
    );
    const headers = {
      ...paypalWebhookHeaders(rawBody),
      "paypal-transmission-sig": "invalid-signature"
    };

    const webhookResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paypal",
      headers,
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_pp_invalid_sig"
    });

    expect(webhookResponse.statusCode).toBe(401);
    expect(webhookResponse.json().error.code).toBe("invalid_signature");
    expect(overviewResponse.json().data.subscription).toBeNull();
  });
});
