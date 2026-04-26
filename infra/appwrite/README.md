# Appwrite Deployment Playbook

This workspace deploys to **Appwrite Sites** as three independent services:

1. `@tradara/bot-api` (`apps/bot-api`)
2. `@tradara/admin-web` (`apps/admin-web`)
3. `@tradara/marketing-site` (`apps/marketing-site`)

Production hostnames:

- Marketing: `https://tradara.sagestonelab.tech`
- Admin: `https://tradara-adm.sagestonelab.tech`
- API: `https://tradara-api.sagestonelab.tech`

> Tradara is Telegram-first guidance software (not an execution bot). Keep webhook verification and billing-derived entitlement logic enabled in production.

## Shared Site Build Settings

- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Provider root directory:** repository root (`/`)
- **Node version:** `20.11+` (or latest Node 20 LTS)
- Use package-scoped build commands only (never monorepo-wide build commands for a single Site).

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
