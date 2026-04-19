import { describe, expect, it } from "vitest";
import { adminDiagnosticsDataSchema, adminWebhookEventsDataSchema } from "@tradara/shared-types";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import {
  billingTestEnv,
  createPayPalWebhookPayload,
  createXenditWebhookPayload,
  paypalWebhookHeaders
} from "./helpers/billing-fixtures";

describe("admin billing diagnostics", () => {
  it("surfaces provider-specific webhook traces for billing events", async () => {
    const app = buildApp(createContainer(billingTestEnv, { persistence: "memory" }));

    await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers: {
        "content-type": "application/json",
        "x-callback-token": billingTestEnv.XENDIT_WEBHOOK_TOKEN
      },
      payload: JSON.stringify(
        createXenditWebhookPayload({
          event: "invoice.paid",
          eventId: "x_evt_admin_001",
          externalId: "sub_x_admin_001",
          userId: "user_x_admin",
          planId: "tradara-pro-monthly"
        })
      )
    });

    await app.inject({
      method: "POST",
      url: "/v1/webhooks/paypal",
      headers: paypalWebhookHeaders(),
      payload: JSON.stringify(
        createPayPalWebhookPayload({
          eventType: "CHECKOUT.ORDER.COMPLETED",
          eventId: "pp_evt_admin_001",
          userId: "user_pp_admin",
          planId: "tradara-pro-monthly",
          subscriptionId: "sub_pp_admin_001"
        })
      )
    });

    const webhookEventsResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/webhook-events"
    });
    const diagnosticsResponse = await app.inject({
      method: "GET",
      url: "/v1/admin/diagnostics"
    });

    const webhookEvents = adminWebhookEventsDataSchema.parse(webhookEventsResponse.json().data);
    const diagnostics = adminDiagnosticsDataSchema.parse(diagnosticsResponse.json().data);

    expect(webhookEvents.rows.map((row) => row.provider)).toEqual(
      expect.arrayContaining(["xendit", "paypal"])
    );
    expect(diagnostics.recentWebhookEvents.map((row) => row.provider)).toEqual(
      expect.arrayContaining(["xendit", "paypal"])
    );
  });
});
