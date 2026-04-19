import { describe, expect, it } from "vitest";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import {
  billingTestEnv,
  createXenditWebhookPayload
} from "./helpers/billing-fixtures";

describe("billing entitlement flow", () => {
  it("reconciliation grants Telegram access after billing activates entitlement", async () => {
    const container = createContainer(billingTestEnv, { persistence: "memory" });
    const app = buildApp(container);
    const rawBody = JSON.stringify(
      createXenditWebhookPayload({
        event: "invoice.paid",
        eventId: "x_evt_reconcile_001",
        externalId: "sub_x_reconcile_001",
        userId: "user_x_reconcile",
        planId: "tradara-pro-monthly"
      })
    );

    await app.inject({
      method: "POST",
      url: "/v1/webhooks/xendit",
      headers: {
        "content-type": "application/json",
        "x-callback-token": billingTestEnv.XENDIT_WEBHOOK_TOKEN
      },
      payload: rawBody
    });

    await container.jobs.channelAccessReconciliation.runOnce("Billing activation reconciliation");

    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_x_reconcile"
    });

    expect(overviewResponse.json().data.subscription.status).toBe("active");
    expect(overviewResponse.json().data.entitlement.premiumChannelEligible).toBe(true);
    expect(overviewResponse.json().data.accessRecord.status).toBe("granted");
  });
});
