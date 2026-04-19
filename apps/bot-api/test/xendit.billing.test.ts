import { describe, expect, it } from "vitest";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import {
  billingTestEnv,
  createXenditWebhookPayload
} from "./helpers/billing-fixtures";

describe("xendit billing", () => {
  it("rejects webhooks with an invalid callback token", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers: {
        "content-type": "application/json",
        "x-callback-token": "wrong-token"
      },
      payload: JSON.stringify(
        createXenditWebhookPayload({
          event: "invoice.paid",
          eventId: "x_evt_invalid",
          externalId: "sub_x_invalid",
          userId: "user_x_invalid",
          planId: "tradara-pro-monthly"
        })
      )
    });

    expect(response.statusCode).toBe(401);
  });

  it("activates billing state idempotently on a paid webhook", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));
    const rawBody = JSON.stringify(
      createXenditWebhookPayload({
        event: "invoice.paid",
        eventId: "x_evt_paid_001",
        externalId: "sub_x_paid_001",
        userId: "user_x_paid",
        planId: "tradara-pro-monthly"
      })
    );
    const headers = {
      "content-type": "application/json",
      "x-callback-token": billingTestEnv.XENDIT_WEBHOOK_TOKEN
    };

    const firstResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers,
      payload: rawBody
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers,
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_x_paid"
    });

    expect(firstResponse.statusCode).toBe(202);
    expect(secondResponse.statusCode).toBe(200);
    expect(overviewResponse.json().data.subscription.status).toBe("active");
    expect(overviewResponse.json().data.entitlement.premiumChannelEligible).toBe(true);
  });

  it("moves billing into recovery on a failed webhook", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));
    const rawBody = JSON.stringify(
      createXenditWebhookPayload({
        event: "invoice.failed",
        eventId: "x_evt_failed_001",
        externalId: "sub_x_failed_001",
        userId: "user_active",
        planId: "tradara-pro-monthly",
        subscriptionId: "sub_active_001"
      })
    );

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers: {
        "content-type": "application/json",
        "x-callback-token": billingTestEnv.XENDIT_WEBHOOK_TOKEN
      },
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_active"
    });

    expect(response.statusCode).toBe(202);
    expect(overviewResponse.json().data.subscription.status).toBe("past_due");
    expect(overviewResponse.json().data.subscription.gracePeriodEndsAt).not.toBeNull();
    expect(overviewResponse.json().data.entitlement.premiumChannelEligible).toBe(true);
  });
});
