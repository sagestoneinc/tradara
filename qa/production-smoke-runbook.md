# Tradara Production Smoke Runbook

This runbook is aligned to the bot/API routes currently registered in the repo.

Product boundaries:
- Billing is the source of truth for premium entitlement.
- Reconciliation is the control model.
- Telegram is the delivery layer.
- TradingView alerts are setup candidates, not publishable signals by themselves.

Use this for staging or production smoke tests after deploys, migrations, or provider config changes.

## Base Setup

Set these first in your shell:

```bash
export API_BASE_URL="https://tradaraapi.sagestonelab.tech"
export TG_WEBHOOK_SECRET="your-telegram-webhook-secret"
export TV_WEBHOOK_SECRET="your-tradingview-webhook-secret"
export XENDIT_WEBHOOK_TOKEN="your-xendit-webhook-token"
```

Optional pretty JSON helper:

```bash
alias jqp='python3 -m json.tool'
```

## 1. Health

Actual routes:
- `GET /`
- `GET /health`

Run:

```bash
curl -i "$API_BASE_URL/"
curl -i "$API_BASE_URL/health"
```

Expected:
- `200`
- not `404`, `500`, or gateway errors

## 2. Telegram Webhook

Actual route:
- `POST /v1/webhooks/telegram`

Required header:
- `x-telegram-bot-api-secret-token`

`/start`

```bash
curl -i "$API_BASE_URL/v1/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: $TG_WEBHOOK_SECRET" \
  --data '{
    "update_id": 1000001,
    "message": {
      "chat": { "id": 999001, "type": "private" },
      "text": "/start"
    }
  }'
```

Normalization checks:

```bash
curl -i "$API_BASE_URL/v1/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: $TG_WEBHOOK_SECRET" \
  --data '{
    "update_id": 1000002,
    "message": {
      "chat": { "id": 999001, "type": "private" },
      "text": "/plans@TradaraBot"
    }
  }'
```

```bash
curl -i "$API_BASE_URL/v1/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: $TG_WEBHOOK_SECRET" \
  --data '{
    "update_id": 1000003,
    "message": {
      "chat": { "id": 999001, "type": "private" },
      "text": "/start hello"
    }
  }'
```

Edited-message path:

```bash
curl -i "$API_BASE_URL/v1/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: $TG_WEBHOOK_SECRET" \
  --data '{
    "update_id": 1000004,
    "edited_message": {
      "chat": { "id": 999001, "type": "private" },
      "text": "/help"
    }
  }'
```

Bad secret:

```bash
curl -i "$API_BASE_URL/v1/webhooks/telegram" \
  -H "Content-Type: application/json" \
  -H "x-telegram-bot-api-secret-token: wrong-secret" \
  --data '{
    "update_id": 1000005,
    "message": {
      "chat": { "id": 999001, "type": "private" },
      "text": "/faq"
    }
  }'
```

Verify in logs:
- webhook received
- command normalized
- handler found
- send attempt and send result

## 3. TradingView Signal Ingestion

Actual route:
- `POST /v1/webhooks/tradingview/signals`

Accepted auth headers:
- `x-tradara-webhook-secret`
- `x-tradingview-secret`
- or `Authorization: Bearer ...`

Valid payload:

```bash
curl -i "$API_BASE_URL/v1/webhooks/tradingview/signals" \
  -H "Content-Type: application/json" \
  -H "x-tradara-webhook-secret: $TV_WEBHOOK_SECRET" \
  --data '{
    "alertId": "tv-btc-001",
    "symbol": "BTCUSDT",
    "timeframe": "1h",
    "direction": "long",
    "trigger": "breakout-retest",
    "entryZoneLow": 64000,
    "entryZoneHigh": 64300,
    "stopLoss": 63200,
    "takeProfit1": 65000,
    "takeProfit2": 65800,
    "takeProfit3": 66600,
    "marketPrice": 64210,
    "strategyName": "Trend Continuation",
    "note": "Breakout retest candidate",
    "detectedAt": "2026-04-19T14:00:00.000Z",
    "metadata": {
      "exchange": "BINANCE",
      "triggerSource": "tv-alert"
    }
  }'
```

Replay same payload for dedupe:

```bash
curl -i "$API_BASE_URL/v1/webhooks/tradingview/signals" \
  -H "Content-Type: application/json" \
  -H "x-tradara-webhook-secret: $TV_WEBHOOK_SECRET" \
  --data '{
    "alertId": "tv-btc-001",
    "symbol": "BTCUSDT",
    "timeframe": "1h",
    "direction": "long",
    "trigger": "breakout-retest",
    "entryZoneLow": 64000,
    "entryZoneHigh": 64300,
    "stopLoss": 63200,
    "takeProfit1": 65000,
    "takeProfit2": 65800,
    "takeProfit3": 66600,
    "marketPrice": 64210,
    "strategyName": "Trend Continuation",
    "note": "Breakout retest candidate",
    "detectedAt": "2026-04-19T14:00:00.000Z",
    "metadata": {
      "exchange": "BINANCE",
      "triggerSource": "tv-alert"
    }
  }'
```

Bad secret:

```bash
curl -i "$API_BASE_URL/v1/webhooks/tradingview/signals" \
  -H "Content-Type: application/json" \
  -H "x-tradara-webhook-secret: wrong-secret" \
  --data '{"alertId":"tv-btc-bad","symbol":"BTCUSDT"}'
```

Malformed payload:

```bash
curl -i "$API_BASE_URL/v1/webhooks/tradingview/signals" \
  -H "Content-Type: application/json" \
  -H "x-tradara-webhook-secret: $TV_WEBHOOK_SECRET" \
  --data '{"foo":"bar"}'
```

Expected:
- valid request creates raw `SignalInput` plus draft `Signal`
- replay is deduped
- bad secret is rejected
- malformed payload is rejected safely

## 4. Signal Workflow API

Actual routes:
- `POST /v1/signals/:signalId/enrich`
- `POST /v1/signals/:signalId/reviews`
- `POST /v1/signals/:signalId/publish`
- `POST /v1/market-insights`

Enrich a draft signal:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/enrich"
```

Approve:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/reviews" \
  -H "Content-Type: application/json" \
  --data '{
    "reviewerId": "admin-console",
    "action": "approve",
    "notes": "Setup is clean and aligned."
  }'
```

Edit:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/reviews" \
  -H "Content-Type: application/json" \
  --data '{
    "reviewerId": "admin-console",
    "action": "edit",
    "notes": "Refined the wording and invalidation note.",
    "editedTelegramDraft": "Updated premium-ready signal draft"
  }'
```

Watchlist:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/reviews" \
  -H "Content-Type: application/json" \
  --data '{
    "reviewerId": "admin-console",
    "action": "watchlist",
    "notes": "Good idea, but market context is not favorable enough yet."
  }'
```

Reject:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/reviews" \
  -H "Content-Type: application/json" \
  --data '{
    "reviewerId": "admin-console",
    "action": "reject",
    "notes": "Low-quality setup with too much conflict."
  }'
```

Publish:

```bash
curl -i -X POST "$API_BASE_URL/v1/signals/<signal-id>/publish" \
  -H "Content-Type: application/json" \
  --data '{
    "publisherId": "admin-console"
  }'
```

Create market insight draft:

```bash
curl -i -X POST "$API_BASE_URL/v1/market-insights" \
  -H "Content-Type: application/json" \
  --data '{
    "symbol": "CRYPTO-MKT",
    "timeframe": "4h",
    "title": "Morning Market Audit",
    "summary": "BTC stable, ETH neutral, altcoins selective.",
    "body": "Conditions are mixed. Focus on cleaner continuation setups and avoid noisy overextended names.",
    "metadata": {
      "source": "manual-smoke-test"
    }
  }'
```

Expected:
- enrichment moves eligible drafts forward
- review actions change status cleanly
- publish only succeeds for `approved` or `edited`
- publish metadata is stored if delivery succeeds

## 5. Billing Checkout

Actual route:
- `POST /v1/billing/checkout-sessions`

Accepted body:
- `userId`
- `planId`
- optional `provider`
- optional `email`
- optional `successUrl`
- optional `cancelUrl`

Example:

```bash
curl -i -X POST "$API_BASE_URL/v1/billing/checkout-sessions" \
  -H "Content-Type: application/json" \
  --data '{
    "userId": "user_smoke_001",
    "planId": "tradara-pro-monthly",
    "provider": "paypal",
    "email": "smoke@example.com",
    "successUrl": "https://tradara.sagestonelab.tech/billing/success",
    "cancelUrl": "https://tradara.sagestonelab.tech/billing/cancel"
  }'
```

Expected:
- request validates
- response includes `checkoutUrl`, `providerCheckoutSessionId`, and `metadata`

Current honest boundary:
- the backend still chooses provider via `ProviderRouter.selectProvider(userId)`
- requested `provider` is not yet authoritative in the final selection

## 6. Billing Webhooks

Actual route:
- `POST /v1/webhooks/:provider`

Valid providers:
- `paypal`
- `xendit`
- `paymongo`

### Xendit

Current parser expects:
- header `x-callback-token`
- body fields:
  - `event`
  - `data.id`
  - `data.external_id`
  - optional `data.metadata`

Paid:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/xendit" \
  -H "Content-Type: application/json" \
  -H "x-callback-token: $XENDIT_WEBHOOK_TOKEN" \
  --data '{
    "event": "invoice.paid",
    "data": {
      "id": "xendit-event-001",
      "external_id": "sub-smoke-001",
      "metadata": {
        "tradaraUserId": "user_smoke_001",
        "tradaraPlanId": "tradara-pro-monthly",
        "tradaraSubscriptionId": "sub-smoke-001"
      }
    }
  }'
```

Duplicate replay:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/xendit" \
  -H "Content-Type: application/json" \
  -H "x-callback-token: $XENDIT_WEBHOOK_TOKEN" \
  --data '{
    "event": "invoice.paid",
    "data": {
      "id": "xendit-event-001",
      "external_id": "sub-smoke-001",
      "metadata": {
        "tradaraUserId": "user_smoke_001",
        "tradaraPlanId": "tradara-pro-monthly",
        "tradaraSubscriptionId": "sub-smoke-001"
      }
    }
  }'
```

Failed:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/xendit" \
  -H "Content-Type: application/json" \
  -H "x-callback-token: $XENDIT_WEBHOOK_TOKEN" \
  --data '{
    "event": "invoice.failed",
    "data": {
      "id": "xendit-event-002",
      "external_id": "sub-smoke-001",
      "metadata": {
        "tradaraUserId": "user_smoke_001",
        "tradaraPlanId": "tradara-pro-monthly",
        "tradaraSubscriptionId": "sub-smoke-001"
      }
    }
  }'
```

Bad token:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/xendit" \
  -H "Content-Type: application/json" \
  -H "x-callback-token: wrong-token" \
  --data '{"event":"invoice.paid","data":{"id":"bad-001","external_id":"sub-bad"}}'
```

### PayPal

Current parser behavior:
- route exists
- requires `PAYPAL_WEBHOOK_ID` configured
- does not yet do real PayPal remote verification
- expects:
  - `body.id`
  - `body.event_type`
  - relevant `resource.*`

Completed capture:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/paypal" \
  -H "Content-Type: application/json" \
  --data '{
    "id": "WH-PAYPAL-001",
    "event_type": "PAYMENT.CAPTURE.COMPLETED",
    "resource": {
      "status": "COMPLETED",
      "custom_id": "{\"tradaraUserId\":\"user_smoke_001\",\"tradaraPlanId\":\"tradara-pro-monthly\",\"tradaraSubscriptionId\":\"sub-smoke-002\"}"
    }
  }'
```

Failed capture:

```bash
curl -i -X POST "$API_BASE_URL/v1/webhooks/paypal" \
  -H "Content-Type: application/json" \
  --data '{
    "id": "WH-PAYPAL-002",
    "event_type": "PAYMENT.CAPTURE.DENIED",
    "resource": {
      "status": "DENIED",
      "custom_id": "{\"tradaraUserId\":\"user_smoke_001\",\"tradaraPlanId\":\"tradara-pro-monthly\",\"tradaraSubscriptionId\":\"sub-smoke-002\"}"
    }
  }'
```

### PayMongo

Current parser expects:
- header `paymongo-signature`
- raw-body HMAC verification
- body shape under `data.attributes`

Only smoke-test PayMongo if it is still active in the deployed environment.

## 7. Channel Access and Audit

Actual routes:
- `GET /v1/channel-access`
- `GET /v1/channel-access/:userId`
- `POST /v1/channel-access/invite-links`
- `POST /v1/channel-access/reconcile`
- `GET /v1/audit-logs`

Overview:

```bash
curl -s "$API_BASE_URL/v1/channel-access" | jqp
```

By user:

```bash
curl -s "$API_BASE_URL/v1/channel-access/user_smoke_001" | jqp
```

Force reconcile:

```bash
curl -i -X POST "$API_BASE_URL/v1/channel-access/reconcile"
```

Audit logs:

```bash
curl -s "$API_BASE_URL/v1/audit-logs" | jqp
```

## 8. Admin Routes

Actual routes:
- `GET /v1/admin/overview`
- `GET /v1/admin/users`
- `GET /v1/admin/subscriptions`
- `GET /v1/admin/channel-access`
- `GET /v1/admin/webhook-events`
- `GET /v1/admin/diagnostics`
- `GET /v1/admin/audit-logs`
- `GET /v1/admin/signals/review-queue`
- `GET /v1/admin/signals/approved`
- `GET /v1/admin/signals/published`
- `GET /v1/admin/signals/rejected`
- `GET /v1/admin/signals/watchlist`
- `GET /v1/admin/signals/market-insights`
- `GET /v1/admin/signals`

Run:

```bash
curl -s "$API_BASE_URL/v1/admin/overview" | jqp
curl -s "$API_BASE_URL/v1/admin/users" | jqp
curl -s "$API_BASE_URL/v1/admin/subscriptions" | jqp
curl -s "$API_BASE_URL/v1/admin/channel-access" | jqp
curl -s "$API_BASE_URL/v1/admin/webhook-events" | jqp
curl -s "$API_BASE_URL/v1/admin/diagnostics" | jqp
curl -s "$API_BASE_URL/v1/admin/audit-logs" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/review-queue" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/approved" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/published" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/rejected" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/watchlist" | jqp
curl -s "$API_BASE_URL/v1/admin/signals/market-insights" | jqp
curl -s "$API_BASE_URL/v1/admin/signals" | jqp
```

## 9. What to Watch For

- `POST /v1/billing/checkout-sessions`: requested `provider` may not control final provider yet
- `POST /v1/webhooks/paypal`: current verification is not yet full remote PayPal verification
- `POST /v1/signals/:signalId/publish`: live-wired to Telegram in runtime, so use real signal IDs carefully in production
- admin endpoints are exposed by route registration, so deployment-layer protection still matters

## 10. Best End-to-End Happy Path

1. `POST /v1/billing/checkout-sessions`
2. complete real or sandbox checkout
3. `POST /v1/webhooks/xendit` or `POST /v1/webhooks/paypal`
4. `GET /v1/admin/subscriptions`
5. `POST /v1/channel-access/reconcile`
6. `GET /v1/admin/channel-access`
7. `POST /v1/webhooks/tradingview/signals`
8. `POST /v1/signals/:signalId/enrich`
9. `POST /v1/signals/:signalId/reviews`
10. `POST /v1/signals/:signalId/publish`
11. `GET /v1/admin/signals/published`
12. `GET /v1/admin/audit-logs`

## 11. Success Criteria

The smoke test passes when:
- API health routes respond cleanly
- Telegram webhook accepts valid requests and rejects bad secrets
- TradingView webhook creates draft signals and dedupes replays
- billing webhook updates internal subscription truth safely
- reconciliation reflects access changes
- admin read models show the resulting lifecycle data
- approved signals can be reviewed and published with visible auditability
