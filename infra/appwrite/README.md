# Appwrite Deployment Playbook

This workspace can be deployed to **Appwrite Sites** as three independent services:

1. `@tradara/bot-api` (`apps/bot-api`)
2. `@tradara/admin-web` (`apps/admin-web`)
3. `@tradara/marketing-site` (`apps/marketing-site`)

Production hostnames:

- `https://tradara.sagestonelab.tech` → marketing site
- `https://tradara-api.sagestonelab.tech` → bot-api
- `https://tradara-adm.sagestonelab.tech` → admin-web

> Tradara is Telegram-first guidance software (not an execution bot). Keep webhook verification and billing-derived entitlement logic enabled in production.

## Prerequisites

- Appwrite project with three Sites (one per app).
- Git provider connected to Appwrite.
- Environment variables configured in each Site using the `*.env.example` files in this folder.

## Shared Site Build Settings

Use these defaults for each Site deployment:

- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Provider root directory:** repository root (`/`)
- **Node version:** `20.11+` (or latest Node 20 LTS)
- **Important:** do **not** use workspace-wide build commands such as `pnpm build` or `pnpm -r build` for a single Site deployment. Those commands build every app/package in the monorepo and can fail unrelated services.

## Site: bot-api

- **Framework:** Other (Node.js — not Next.js)
- **Rendering / service mode:** SSR / running server
- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Build command:** `pnpm --filter @tradara/bot-api build`
- **Output directory:** `apps/bot-api/dist`
- **Fallback file:** _(leave blank)_
- **Start command:** `pnpm --filter @tradara/bot-api start`
- **Port:** Appwrite injects `PORT`; runtime already falls back from `PORT` to `BOT_API_PORT`.
- **Env template:** `infra/appwrite/bot-api.env.example`

> bot-api is a Fastify/Node API, **not** a Next.js app. It is bundled with tsup into
> `apps/bot-api/dist/server.js` and run with `node dist/server.js`.
> Do not configure it with the Next.js framework or bundler in Appwrite.

### Required production notes

- Set `BOT_API_BASE_URL` to `https://tradara-api.sagestonelab.tech`.
- Set `MARKETING_SITE_BASE_URL` to `https://tradara.sagestonelab.tech`.
- Set secure values for Telegram and billing webhook secrets.
- Use a production `DATABASE_URL` and run migrations before first live webhook traffic.

### Webhook URLs (for provider dashboards)

| Provider    | URL                                                       |
| ----------- | --------------------------------------------------------- |
| Telegram    | `https://tradara-api.sagestonelab.tech/v1/webhooks/telegram`    |
| Xendit      | `https://tradara-api.sagestonelab.tech/v1/webhooks/xendit`      |
| PayPal      | `https://tradara-api.sagestonelab.tech/v1/webhooks/paypal`      |
| TradingView | `https://tradara-api.sagestonelab.tech/v1/webhooks/tradingview` |

## Site: admin-web

- **Framework:** Next.js
- **Rendering:** SSR
- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Build command:** `cp apps/admin-web/next.config.ts ./next.config.ts && pnpm --filter @tradara/admin-web build`
- **Output directory:** `apps/admin-web/.next`
- **Fallback file:** _(leave blank)_
- **Start command:** `pnpm --filter @tradara/admin-web start`
- **Env template:** `infra/appwrite/admin-web.env.example`

### Required production notes

- Set `ADMIN_WEB_BASE_URL` to `https://tradara-adm.sagestonelab.tech`.
- Set `BOT_API_BASE_URL` to `https://tradara-api.sagestonelab.tech`.
- If Clerk is enabled, configure both publishable and secret keys.

## Site: marketing-site

- **Framework:** Next.js
- **Rendering:** SSR
- **Install command:** `corepack enable && pnpm install --frozen-lockfile`
- **Build command:** `cp apps/marketing-site/next.config.ts ./next.config.ts && pnpm --filter @tradara/marketing-site build`
- **Output directory:** `apps/marketing-site/.next`
- **Fallback file:** _(leave blank)_
- **Start command:** `pnpm --filter @tradara/marketing-site start`
- **Env template:** `infra/appwrite/marketing-site.env.example`

### Required production notes

- Set `MARKETING_SITE_BASE_URL` to `https://tradara.sagestonelab.tech`.
- Set `BOT_API_BASE_URL` to `https://tradara-api.sagestonelab.tech`.
- Set `CHECKOUT_SUCCESS_URL=https://tradara.sagestonelab.tech/checkout/success`.
- Set `CHECKOUT_CANCEL_URL=https://tradara.sagestonelab.tech/checkout/cancel`.

## Suggested Deployment Order

1. Run DB migrations (`pnpm db:migrate:deploy`) against production DB.
2. Deploy `bot-api` and confirm `/health` responds.
3. Deploy `marketing-site` and smoke test auth + checkout redirects.
4. Deploy `admin-web` and verify admin auth and signal pages.

## Troubleshooting: Appwrite runs the wrong build target

If Appwrite logs show one Site attempting to build another app (for example, marketing deploy logs that later run `@tradara/bot-api build`), the Site is likely using a monorepo-wide build command.

Use this checklist:

1. Confirm the Site **Install command** is `corepack enable && pnpm install --frozen-lockfile`.
2. Confirm the Site **Build command** is package-scoped with `pnpm --filter <site-package> build`.
3. Confirm the Site **Start command** is package-scoped with `pnpm --filter <site-package> start`.
4. Re-deploy after saving Site settings.

## Troubleshooting: Appwrite treats bot-api as a Next.js app

If Appwrite attempts to run the Next.js bundler against `apps/bot-api/dist`, the Site's
framework setting is incorrect.

- Set **Framework** to **Other** (not Next.js).
- Set **Output directory** to `apps/bot-api/dist`.
- Leave **Fallback file** blank.
- The build command `pnpm --filter @tradara/bot-api build` runs `tsup` which produces
  `apps/bot-api/dist/server.js` — a plain Node ESM bundle.

## Post-deploy Checks

- Telegram webhook requests return successful 2xx from the live `bot-api` endpoint.
- Billing webhooks are verified and logged.
- Premium entitlement changes are reflected in channel-access diagnostics.
- Admin and marketing sites can call `bot-api` over HTTPS.
