# Telegram Premium Access Architecture

## Source Of Truth

- Billing and subscription state decide entitlement.
- Telegram is only the delivery and membership layer.
- Webhook observations can confirm or contradict delivery state, but they do not create entitlement on their own.

## Core Components

- `EntitlementService`: turns subscription state into access eligibility.
- `ChannelAccessService`: stages grant/revoke work and records audit logs.
- `TelegramWebhookService`: validates webhook secrets, enforces idempotency, and records membership observations.
- `ChannelAccessReconciliationJob`: compares desired state versus observed state and stages corrective actions.

## Current Stub Boundaries

- Real invite-link creation is not wired to live Telegram credentials yet.
- Real member revocation is not wired yet.
- Persistence is modeled in Prisma and mirrored with in-memory repositories for the current scaffold.

