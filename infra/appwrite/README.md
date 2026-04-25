# Appwrite Deployment Playbook

This workspace can be deployed to **Appwrite Sites** as three independent services:

1. `@tradara/bot-api` (`apps/bot-api`)
2. `@tradara/admin-web` (`apps/admin-web`)
3. `@tradara/marketing-site` (`apps/marketing-site`)

Production hostnames:

- `https://tradara.sagestonelab.tech` → marketing site
- `https://tradara-api.sagestonelab.tech` → bot-api
- `https://tradara-admin.sagestonelab.tech` → admin-web

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

- **Service root (monorepo filter target):** `@tradara/bot-api`
- **Build command:** `pnpm --filter @tradara/bot-api build`
- **Start command:** `pnpm --filter @tradara/bot-api start`
- **Port:** Appwrite injects `PORT`; runtime already falls back from `PORT` to `BOT_API_PORT`.
- **Env template:** `infra/appwrite/bot-api.env.example`

### Required production notes

- Set `BOT_API_BASE_URL` to your public bot-api HTTPS URL.
- Set `MARKETING_SITE_BASE_URL` to your marketing site HTTPS URL.
- Set secure values for Telegram and billing webhook secrets.
- Use a production `DATABASE_URL` and run migrations before first live webhook traffic.

## Site: admin-web

- **Service root (monorepo filter target):** `@tradara/admin-web`
- **Build command:** `pnpm --filter @tradara/admin-web build`
- **Start command:** `pnpm --filter @tradara/admin-web start`
- **Env template:** `infra/appwrite/admin-web.env.example`

### Required production notes

- Set `ADMIN_WEB_BASE_URL` to the deployed admin hostname.
- Set `BOT_API_BASE_URL` to the deployed bot-api hostname.
- If Clerk is enabled, configure both publishable and secret keys.

## Site: marketing-site

- **Service root (monorepo filter target):** `@tradara/marketing-site`
- **Build command:** `pnpm --filter @tradara/marketing-site build`
- **Start command:** `pnpm --filter @tradara/marketing-site start`
- **Env template:** `infra/appwrite/marketing-site.env.example`

### Required production notes

- Set `MARKETING_SITE_BASE_URL` to the deployed public hostname.
- Set `BOT_API_BASE_URL` so checkout/account links point to your live API.

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

## Post-deploy Checks

- Telegram webhook requests return successful 2xx from the live `bot-api` endpoint.
- Billing webhooks are verified and logged.
- Premium entitlement changes are reflected in channel-access diagnostics.
- Admin and marketing sites can call `bot-api` over HTTPS.
