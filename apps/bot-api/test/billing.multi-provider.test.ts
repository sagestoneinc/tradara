import { describe, expect, it } from "vitest";

import { WebhookParser } from "../src/modules/billing/providers/webhook-parser";
import {
  billingTestEnv,
  createPayPalWebhookPayload,
  createXenditWebhookPayload,
  paypalWebhookHeaders
} from "./helpers/billing-fixtures";

describe("billing multi-provider normalization", () => {
  it("normalizes a Xendit paid invoice into the internal billing event shape", () => {
    const parser = new WebhookParser(billingTestEnv);
    const payload = createXenditWebhookPayload({
      event: "invoice.paid",
      eventId: "x_evt_norm_001",
      externalId: "sub_x_norm_001",
      userId: "user_x_norm",
      planId: "tradara-pro-monthly"
    });

    const parsed = parser.parseAndVerify(
      "xendit",
      { "x-callback-token": billingTestEnv.XENDIT_WEBHOOK_TOKEN },
      JSON.stringify(payload),
      payload as Record<string, unknown>
    );

    expect(parsed.provider).toBe("xendit");
    expect(parsed.status).toBe("paid");
    expect(parsed.eventId).toBe("x_evt_norm_001");
    expect(parsed.subscriptionId).toBe("sub_x_norm_001");
    expect(parsed.metadata?.tradaraPlanId).toBe("tradara-pro-monthly");
  });

  it("normalizes a PayPal completed order into the internal billing event shape", () => {
    const parser = new WebhookParser(billingTestEnv);
    const payload = createPayPalWebhookPayload({
      eventType: "CHECKOUT.ORDER.COMPLETED",
      eventId: "pp_evt_norm_001",
      userId: "user_pp_norm",
      planId: "tradara-pro-annual",
      subscriptionId: "sub_pp_norm_001"
    });
    const rawBody = JSON.stringify(payload);

    const parsed = parser.parseAndVerify(
      "paypal",
      paypalWebhookHeaders(rawBody),
      rawBody,
      payload as Record<string, unknown>
    );

    expect(parsed.provider).toBe("paypal");
    expect(parsed.status).toBe("paid");
    expect(parsed.eventId).toBe("pp_evt_norm_001");
    expect(parsed.subscriptionId).toBe("sub_pp_norm_001");
    expect(parsed.metadata?.tradaraPlanId).toBe("tradara-pro-annual");
  });
});
