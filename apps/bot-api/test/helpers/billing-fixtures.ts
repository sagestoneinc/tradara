import { loadBotApiEnv } from "@tradara/shared-config";

import { encodePayPalCustomId } from "../../src/modules/billing/providers/paypal-metadata";

export const billingTestEnv = loadBotApiEnv({
  NODE_ENV: "test",
  BOT_API_PORT: "3001",
  BOT_API_BASE_URL: "http://localhost:3001",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
  TELEGRAM_BOT_TOKEN: "token",
  TELEGRAM_WEBHOOK_SECRET: "telegram-secret",
  TELEGRAM_PREMIUM_CHANNEL_ID: "-1000001",
  TELEGRAM_BOT_USERNAME: "tradara_bot",
  PAYMONGO_WEBHOOK_SECRET: "paymongo-secret",
  PAYPAL_WEBHOOK_ID: "paypal-webhook-id",
  XENDIT_SECRET_KEY: "xendit-secret",
  XENDIT_WEBHOOK_TOKEN: "xendit-token",
  ACCESS_GRACE_PERIOD_HOURS: "72"
});

const BILLING_UNIX_TS = 1776513600;

export function createXenditWebhookPayload(input: {
  event: "invoice.paid" | "invoice.failed" | "invoice.expired";
  eventId: string;
  externalId: string;
  userId: string;
  planId: "tradara-pro-monthly" | "tradara-pro-quarterly" | "tradara-pro-annual";
  subscriptionId?: string;
}) {
  return {
    event: input.event,
    data: {
      id: input.eventId,
      external_id: input.externalId,
      metadata: {
        tradaraUserId: input.userId,
        tradaraPlanId: input.planId,
        tradaraSubscriptionId: input.subscriptionId ?? input.externalId
      }
    }
  };
}

export function createPayPalWebhookPayload(input: {
  eventType: "CHECKOUT.ORDER.COMPLETED" | "PAYMENT.CAPTURE.COMPLETED" | "PAYMENT.CAPTURE.DENIED";
  eventId: string;
  userId: string;
  planId: "tradara-pro-monthly" | "tradara-pro-quarterly" | "tradara-pro-annual";
  subscriptionId: string;
}) {
  return {
    id: input.eventId,
    event_type: input.eventType,
    resource: {
      id: `pp_${input.subscriptionId}`,
      status: input.eventType === "PAYMENT.CAPTURE.DENIED" ? "DENIED" : "COMPLETED",
      custom_id: encodePayPalCustomId({
        tradaraUserId: input.userId,
        tradaraPlanId: input.planId,
        tradaraSubscriptionId: input.subscriptionId
      }),
      purchase_units: [
        {
          reference_id: input.subscriptionId,
          custom_id: encodePayPalCustomId({
            tradaraUserId: input.userId,
            tradaraPlanId: input.planId,
            tradaraSubscriptionId: input.subscriptionId
          })
        }
      ]
    }
  };
}

export function paypalWebhookHeaders() {
  return {
    "content-type": "application/json",
    "paypal-transmission-id": "transmission_001",
    "paypal-transmission-time": new Date(BILLING_UNIX_TS * 1000).toISOString(),
    "paypal-transmission-sig": "test-signature"
  };
}
