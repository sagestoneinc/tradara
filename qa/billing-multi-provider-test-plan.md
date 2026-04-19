# Tradara Multi-Provider Billing Test Plan

This plan covers end-to-end validation for Tradara billing with multiple providers while preserving the current product architecture:

- Billing is the source of truth for premium entitlement.
- Reconciliation is the control model for access changes.
- Telegram is the delivery layer.

The goal is to verify that Xendit and PayPal both drive one normalized internal subscription model, one entitlement model, and one operator-facing diagnostics model.

## Test Matrix

| ID | Scenario | Provider | Trigger | Expected Billing Result | Expected Access Result | Expected Admin Result |
| --- | --- | --- | --- | --- | --- | --- |
| `X1` | Happy path activation | `xendit` | Create checkout, then valid paid webhook | Subscription becomes `active`; webhook stored and marked processed | Reconciliation stages/grants access; Telegram delivery succeeds or retries safely | Provider shown as `xendit`; last event/status visible |
| `P1` | Happy path activation | `paypal` | Create checkout, then valid approval/payment webhook | Subscription becomes `active`; webhook stored and marked processed | Reconciliation stages/grants access; Telegram delivery succeeds or retries safely | Provider shown as `paypal`; last event/status visible |
| `X2` | Failed payment | `xendit` | Valid failed-payment webhook | Subscription becomes `past_due` or `grace_period` per mapping | No new grant; existing access eventually moves toward revoke via reconciliation | Failure reason and last billing outcome visible |
| `P2` | Failed payment | `paypal` | Valid failed-payment webhook | Subscription becomes `past_due` or `grace_period` per mapping | No new grant; existing access eventually moves toward revoke via reconciliation | Failure reason and last billing outcome visible |
| `X3` | Duplicate webhook | `xendit` | Send same webhook twice | First event processed, second deduped | No duplicate grant/revoke or extra state churn | Duplicate flag or dedupe trace visible |
| `P3` | Duplicate webhook | `paypal` | Send same webhook twice | First event processed, second deduped | No duplicate grant/revoke or extra state churn | Duplicate flag or dedupe trace visible |
| `X4` | Canceled subscription | `xendit` | Valid cancellation webhook | Subscription becomes `canceled` | Reconciliation stages revoke; Telegram revoke executes or fails visibly | Cancellation trace visible in diagnostics |
| `P4` | Canceled subscription | `paypal` | Valid cancellation webhook | Subscription becomes `canceled` or `suspended` per internal mapping | Reconciliation stages revoke; Telegram revoke executes or fails visibly | Cancellation or suspension visible |
| `X5` | Expired subscription | `xendit` | Valid expiration webhook | Subscription becomes `expired` | Reconciliation stages revoke | Expiration visible |
| `P5` | Expired subscription | `paypal` | Valid expiration webhook | Subscription becomes `expired` | Reconciliation stages revoke | Expiration visible |
| `X6` | Signature failure | `xendit` | Invalid webhook signature/token | Event rejected; not applied to subscription | No entitlement/access change | Rejected event visible if stored; audit trail shows failure |
| `P6` | Signature failure | `paypal` | Invalid webhook signature | Event rejected; not applied to subscription | No entitlement/access change | Rejected event visible if stored; audit trail shows failure |
| `M1` | Provider selection at checkout | both | `POST /v1/billing/checkout-sessions` with `provider` | Correct provider-specific checkout URL returned | No access change yet | Checkout creation audit event visible |
| `M2` | Unsupported provider | n/a | Checkout request with bad provider | `400` or validation error | None | No misleading live state |
| `R1` | Restart-safe dedupe | both | Process webhook, restart app, replay same webhook | Replay stays deduped | No duplicate access actions | Event history persists |
| `T1` | Telegram delivery after active entitlement | both | Active subscription followed by reconciliation | Billing state remains authoritative | Grant issued once; invite/revoke trace stored durably | Correlation from billing to delivery visible |
| `A1` | Admin diagnostics visibility | both | Any of the above | Provider, external IDs, last event, status, failure info all surfaced | Delivery status linked but not treated as source of truth | Admin pages show provider-aware data |

## Suggested Automated Tests

### API and domain tests

- Checkout-session endpoint
  - Returns Xendit checkout URL when `provider: "xendit"`.
  - Returns PayPal approval URL when `provider: "paypal"`.
  - Rejects unsupported provider.
  - Records audit entry for checkout initiation.
- Xendit webhook ingestion
  - Valid signature plus paid event activates subscription.
  - Failed event maps to internal recovery state.
  - Canceled or expired events map to internal terminal states.
  - Duplicate event is ignored after first processing.
- PayPal webhook ingestion
  - Valid signature plus approval/payment event activates subscription.
  - Failed payment maps to internal recovery state.
  - Canceled, suspended, or expired events map correctly.
  - Duplicate event is ignored after first processing.
- Webhook persistence
  - `provider + externalEventId` dedupe survives process restart.
  - Invalid signature does not mutate subscription state.
  - Processed status, duplicate flag, and correlation ID are persisted.
- Reconciliation integration
  - Active subscription produces grant action.
  - Canceled or expired subscription produces revoke action.
  - Duplicate webhook does not produce duplicate reconciliation side effects.
- Telegram delivery integration
  - After active entitlement, reconciliation calls delivery layer once.
  - Retryable Telegram failure does not corrupt billing truth.
  - Non-retryable Telegram failure is visible in durable status fields.
- Admin read model
  - Mixed-provider subscriptions render provider-aware snapshots.
  - Failed billing events appear in diagnostics.
  - Billing plus Telegram traces can be correlated by user, subscription, time, and correlation ID.

### Recommended test files

- `apps/bot-api/test/xendit.billing.test.ts`
- `apps/bot-api/test/paypal.billing.test.ts`
- `apps/bot-api/test/billing.multi-provider.test.ts`
- extend `apps/bot-api/test/admin.routes.test.ts`
- extend `apps/admin-web/test/admin-view-models.test.ts`

### Recommended integration seams to fake

- Provider HTTP clients
- Telegram Bot API adapter
- Clock and ID generator where correlation matters

## Suggested Manual QA Tests

### Staging checklist

1. Open the pricing page and verify both upgrade options are visible and distinct.
2. Start checkout with Xendit and confirm redirect lands on a real Xendit-hosted flow.
3. Start checkout with PayPal and confirm redirect lands on a real PayPal-hosted flow.
4. Complete a real or sandbox payment in each provider and verify:
   - webhook arrives
   - subscription becomes `active`
   - reconciliation runs
   - Telegram access is granted or invite issued
   - admin diagnostics show provider, event, status, and delivery result
5. Trigger or simulate failed payment in each provider and verify:
   - subscription moves to recovery state
   - no false grant occurs
   - admin shows failure reason and last outcome
6. Replay the exact same webhook payload and verify:
   - no duplicate state transition
   - no duplicate Telegram action
   - diagnostics reflect dedupe
7. Send webhook with invalid signature and verify:
   - request rejected or quarantined
   - no subscription mutation
   - failure is visible to operators
8. Cancel or expire a subscription in each provider and verify:
   - normalized internal state updates
   - reconciliation stages revoke
   - Telegram revoke path executes or fails visibly
9. Use bot `/upgrade` and verify it sends the user to the provider-aware upgrade path, not a stale single-provider path.
10. Restart the API after a processed webhook, replay that webhook, and verify dedupe still holds.

## Biggest Operational Risks Still Remaining

- PayMongo-era assumptions still exist in parts of the repo, especially around billing summary and route structure. If those are not fully normalized, diagnostics may misreport the active provider.
- Dedupe is only as strong as `provider + external event ID`. If either provider sends unstable IDs, duplicate protection will be weaker than expected.
- Telegram delivery can still fail after billing succeeds. That is acceptable architecturally, but operators need strong correlation between billing activation, reconciliation, and delivery attempt outcomes.
- Checkout entry points can drift. Marketing site and bot must both hit the same provider-aware checkout API or users will see inconsistent upgrade paths.
- Signature verification must be tested against real provider payloads, not only mocked shapes. This is one of the easiest places to accidentally imply production readiness without actually having it.

## Exit Criteria

This phase is ready for controlled beta validation when:

- Both providers can initiate checkout through one API entry point.
- Both webhook flows validate, dedupe, and normalize events safely.
- Internal subscription state transitions remain provider-agnostic.
- Reconciliation continues to govern Telegram access changes.
- Admin diagnostics can explain billing, reconciliation, and Telegram delivery outcomes clearly.
- Automated tests and typecheck remain green.
