import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";

import { buildApp } from "../src/app";
import { createContainer } from "../src/container";
import { createHmacSha256Hex } from "../src/lib/security";

const env = loadBotApiEnv({
  NODE_ENV: "test",
  BOT_API_PORT: "3001",
  BOT_API_BASE_URL: "http://localhost:3001",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
  TELEGRAM_BOT_TOKEN: "token",
  TELEGRAM_WEBHOOK_SECRET: "telegram-secret",
  TELEGRAM_PREMIUM_CHANNEL_ID: "-1000001",
  TELEGRAM_BOT_USERNAME: "tradara_bot",
  PAYMONGO_WEBHOOK_SECRET: "paymongo-secret",
  ACCESS_GRACE_PERIOD_HOURS: "72"
});

const CURRENT_BILLING_TIMESTAMP = "1776513600";

function createPaymongoSignature(rawBody: string, timestamp = CURRENT_BILLING_TIMESTAMP): string {
  const digest = createHmacSha256Hex(env.PAYMONGO_WEBHOOK_SECRET, `${timestamp}.${rawBody}`);
  return `t=${timestamp},te=${digest},li=`;
}

describe("billing routes", () => {
  it("returns honest checkout scaffolding without claiming a live provider session", async () => {
    const app = buildApp(createContainer(env));
    const response = await app.inject({
      method: "POST",
      url: "/v1/billing/checkout-sessions",
      payload: {
        userId: "user_checkout",
        planId: "tradara-pro-monthly",
        email: "user@example.com"
      }
    });

    expect(response.statusCode).toBe(202);
    expect(response.json().data.executionState).toBe("pending");
    expect(response.json().data.checkoutUrl).toBeNull();
    expect(response.json().data.metadata.tradaraUserId).toBe("user_checkout");
  });

  it("rejects PayMongo webhooks with an invalid signature", async () => {
    const app = buildApp(createContainer(env));
    const rawBody = JSON.stringify({
      data: {
        id: "evt_invalid",
        type: "event",
        attributes: {
          type: "payment.paid",
          livemode: false,
          data: {
            id: "pay_invalid",
            type: "payment",
            attributes: {
              paid_at: Number(CURRENT_BILLING_TIMESTAMP),
              payment_intent_id: "pi_invalid",
              metadata: {
                tradaraUserId: "user_invalid",
                tradaraPlanId: "tradara-pro-monthly"
              }
            }
          }
        }
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paymongo",
      headers: {
        "content-type": "application/json",
        "paymongo-signature": `t=${CURRENT_BILLING_TIMESTAMP},te=deadbeef,li=`
      },
      payload: rawBody
    });

    expect(response.statusCode).toBe(401);
  });

  it("processes a successful payment idempotently and updates entitlement from billing state", async () => {
    const app = buildApp(createContainer(env));
    const rawBody = JSON.stringify({
      data: {
        id: "evt_paid_001",
        type: "event",
        attributes: {
          type: "checkout_session.payment.paid",
          livemode: false,
          data: {
            id: "cs_paid_001",
            type: "checkout_session",
            attributes: {
              paid_at: Number(CURRENT_BILLING_TIMESTAMP),
              payments: [
                {
                  id: "pay_paid_001",
                  attributes: {
                    payment_intent_id: "pi_paid_001",
                    metadata: {
                      tradaraUserId: "user_billing_paid",
                      tradaraPlanId: "tradara-pro-monthly",
                      tradaraSubscriptionId: "sub_billing_paid"
                    }
                  }
                }
              ]
            }
          }
        }
      }
    });

    const headers = {
      "content-type": "application/json",
      "paymongo-signature": createPaymongoSignature(rawBody)
    };

    const firstResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paymongo",
      headers,
      payload: rawBody
    });
    const secondResponse = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paymongo",
      headers,
      payload: rawBody
    });
    const overviewResponse = await app.inject({
      method: "GET",
      url: "/v1/channel-access/user_billing_paid"
    });

    expect(firstResponse.statusCode).toBe(202);
    expect(secondResponse.statusCode).toBe(200);
    expect(overviewResponse.json().data.subscription.status).toBe("active");
    expect(overviewResponse.json().data.entitlement.premiumChannelEligible).toBe(true);
  });

  it("moves a subscriber into billing recovery on payment failure while preserving grace-based entitlement", async () => {
    const app = buildApp(createContainer(env));
    const rawBody = JSON.stringify({
      data: {
        id: "evt_failed_001",
        type: "event",
        attributes: {
          type: "payment.failed",
          livemode: false,
          data: {
            id: "pay_failed_001",
            type: "payment",
            attributes: {
              failed_at: Number(CURRENT_BILLING_TIMESTAMP),
              payment_intent_id: "pi_failed_001",
              metadata: {
                tradaraUserId: "user_active",
                tradaraPlanId: "tradara-pro-monthly",
                tradaraSubscriptionId: "sub_active_001"
              }
            }
          }
        }
      }
    });

    const response = await app.inject({
      method: "POST",
      url: "/v1/webhooks/paymongo",
      headers: {
        "content-type": "application/json",
        "paymongo-signature": createPaymongoSignature(rawBody)
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
