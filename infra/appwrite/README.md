# Appwrite Deployment Playbook

Use this runbook when creating or updating Tradara on Appwrite Sites.

## Quick Start (recommended)

Tradara deploys as three independent services from one monorepo:

| Service | Workspace package | App path | Port |
|---|---|---|---|
| bot-api | `@tradara/bot-api` | `apps/bot-api` | `3001` |
| marketing-site | `@tradara/marketing-site` | `apps/marketing-site` | `3003` |
| admin-web | `@tradara/admin-web` | `apps/admin-web` | `3002` |

1. Confirm production DNS points to the hostnames listed below.
2. Copy `infra/appwrite/<service>.env.example` into each Site environment.
3. Set **provider root directory** to `/` for every Site.
4. Deploy in order: `bot-api` → `marketing-site` → `admin-web`.
5. Run smoke checks immediately after each deploy.

## Local Pre-Deploy Validation

Run these from repo root before pushing deployment changes:

```bash
corepack enable
pnpm install --frozen-lockfile

pnpm --filter @tradara/bot-api build
pnpm --filter @tradara/marketing-site build
pnpm --filter @tradara/admin-web build
```

> Keep service builds isolated (use `--filter`) so Appwrite failures are easier to diagnose.

Production hostnames:

- Marketing: `https://tradara.sagestonelab.tech`
- Admin: `https://tradara-adm.sagestonelab.tech`
- API: `https://tradara-api.sagestonelab.tech`

> Tradara is Telegram-first guidance software (not an execution bot). Keep webhook verification and billing-derived entitlement logic enabled in production.

## Shared Appwrite Site Settings

- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Provider root directory:** repository root (`/`)
- **Node version:** `20.11+` (or latest Node 20 LTS)
- Use package-scoped build commands only.

## Appwrite Site Creation (repeat for each service)

1. In Appwrite Console, create a **Site**.
2. Connect this Git repository and select the deployment branch.
3. Set the provider root directory to `/`.
4. Configure framework/runtime, build command, output directory, and start command exactly as listed below.
5. Add environment variables from the corresponding template.
6. Trigger first deploy and validate logs before enabling traffic.

## Site: bot-api (Fastify / Node)

- **Framework:** Other (Node service, not Next.js)
- **Rendering / service mode:** SSR / running Node server
- **Build command:** `pnpm --filter @tradara/bot-api build`
- **Output directory:** `apps/bot-api/dist`
- **Fallback file:** _(blank)_
- **Runtime entry:** compiled server artifact at `apps/bot-api/dist/server.js`
- **Start command (if configured):** `pnpm --filter @tradara/bot-api start`
- **Env template:** `infra/appwrite/bot-api.env.example`

## Site: admin-web (Next.js)

- **Framework:** Next.js
- **Rendering:** SSR
- **Build command:** `cp apps/admin-web/next.config.ts ./next.config.ts && pnpm --filter @tradara/admin-web build`
- **Output directory:** `apps/admin-web/.next`
- **Fallback file:** _(blank)_
- **Start command:** `pnpm --filter @tradara/admin-web start`
- **Env template:** `infra/appwrite/admin-web.env.example`

## Site: marketing-site (Next.js)

- **Framework:** Next.js
- **Rendering:** SSR
- **Build command:** `cp apps/marketing-site/next.config.ts ./next.config.ts && pnpm --filter @tradara/marketing-site build`
- **Output directory:** `apps/marketing-site/.next`
- **Fallback file:** _(blank)_
- **Start command:** `pnpm --filter @tradara/marketing-site start`
- **Env template:** `infra/appwrite/marketing-site.env.example`

## Production URLs to Keep Consistent

- `BOT_API_BASE_URL=https://tradara-api.sagestonelab.tech`
- `ADMIN_WEB_BASE_URL=https://tradara-adm.sagestonelab.tech`
- `MARKETING_SITE_BASE_URL=https://tradara.sagestonelab.tech`
- `CHECKOUT_SUCCESS_URL=https://tradara.sagestonelab.tech/checkout/success`
- `CHECKOUT_CANCEL_URL=https://tradara.sagestonelab.tech/checkout/cancel`

Webhook URLs:

- Telegram: `https://tradara-api.sagestonelab.tech/v1/webhooks/telegram`
- Xendit: `https://tradara-api.sagestonelab.tech/v1/webhooks/xendit`
- PayPal: `https://tradara-api.sagestonelab.tech/v1/webhooks/paypal`
- TradingView: `https://tradara-api.sagestonelab.tech/v1/webhooks/tradingview`

## Suggested Deployment Order

1. Run DB migrations (`pnpm db:migrate:deploy`) against production DB.
2. Deploy `bot-api` and confirm `/health` responds.
3. Deploy `marketing-site` and smoke test auth + checkout redirects.
4. Deploy `admin-web` and verify admin auth and signal pages.

## CLI Deployment Instructions (per service)

Use these commands from repo root when validating builds locally before Appwrite deploys:

```bash
corepack enable
pnpm install --frozen-lockfile

# 1) API
pnpm --filter @tradara/bot-api build
pnpm --filter @tradara/bot-api start

# 2) Marketing site
pnpm --filter @tradara/marketing-site build
pnpm --filter @tradara/marketing-site start

# 3) Admin web
pnpm --filter @tradara/admin-web build
pnpm --filter @tradara/admin-web start
```

## Production Availability Checks

Run these checks after each production deploy:

```bash
# DNS
getent hosts tradara-api.sagestonelab.tech
getent hosts tradara.sagestonelab.tech
getent hosts tradara-adm.sagestonelab.tech

# API health
curl -i https://tradara-api.sagestonelab.tech/health

# Frontends
curl -I https://tradara.sagestonelab.tech
curl -I https://tradara-adm.sagestonelab.tech
```

If smoke checks fail, first confirm the API domain uses the hyphenated hostname:
`tradara-api.sagestonelab.tech` (not `tradaraapi.sagestonelab.tech`).

## Post-Deploy Verification

- API health check returns `200`: `GET /health`
- Telegram webhook endpoint is reachable and verification remains enabled.
- Marketing checkout success/cancel routes resolve correctly.
- Admin can sign in and view premium access state.
- Recent billing events still reconcile to entitlement state.

## Appwrite Database Setup

Set the four env vars, then run the one-time schema provisioning script:

```bash
export APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
export APPWRITE_PROJECT_ID=your-project-id
export APPWRITE_API_KEY=your-api-key
export APPWRITE_DATABASE_ID=your-database-id

npx tsx infra/appwrite/setup-database.ts
```

The script is idempotent — existing collections and attributes are skipped.

## Persistence Mode

Set `PERSISTENCE=appwrite` in the bot-api environment to route all repository calls through
Appwrite Database instead of PostgreSQL. When using Appwrite persistence, `DATABASE_URL` is not
required.

## Collection IDs

| Collection | ID |
|---|---|
| Users | `users` |
| Subscriptions | `subscriptions` |
| Channel Access | `channel_access` |
| Telegram Invites | `telegram_invites` |
| Telegram Link Sessions | `telegram_link_sessions` |
| Audit Logs | `audit_logs` |
| Webhook Events | `webhook_events` |
| Signal Inputs | `signal_inputs` |
| Signals | `signals` |
| Signal Reviews | `signal_reviews` |
| Market Insights | `market_insights` |

## Appwrite Functions

Deploy the channel-access reconciliation function (runs hourly via cron):

```bash
appwrite deploy function --function-id reconciliation
```

The function calls `POST /v1/admin/reconcile` on the bot-api. Configure these env vars on the
function in the Appwrite Console:

- `BOT_API_BASE_URL` — e.g. `https://tradara-api.sagestonelab.tech`
- `ADMIN_API_SECRET` — must match the `x-admin-secret` header expected by bot-api
