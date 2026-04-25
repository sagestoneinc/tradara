# Appwrite Deployment Playbook

This workspace can be deployed to **Appwrite Sites** as three independent services:

1. `@tradara/bot-api` (`apps/bot-api`)
2. `@tradara/admin-web` (`apps/admin-web`)
3. `@tradara/marketing-site` (`apps/marketing-site`)

> Tradara is Telegram-first guidance software (not an execution bot). Keep webhook verification and billing-derived entitlement logic enabled in production.

## Deployment Assets in this Repo

- `apps/bot-api/Dockerfile.appwrite`
- `apps/admin-web/Dockerfile.appwrite`
- `apps/marketing-site/Dockerfile.appwrite`
- `infra/appwrite/sites.manifest.json` (reference map for the three Sites)
- `infra/appwrite/*.env.example` (per-service environment templates)

## Prerequisites

- Appwrite project with three Sites (one per app).
- Git provider connected to Appwrite.
- Environment variables configured in each Site using the `*.env.example` files in this folder.

## Site Configuration (Appwrite Console)

Create three Sites pointing to this repository and use **Dockerfile build mode**:

- **Repository root:** `/`
- **Build mode:** `Dockerfile`
- **Dockerfile path:** service-specific `Dockerfile.appwrite`
- **Runtime port env:** Appwrite injects `PORT`; Dockerfiles do not hardcode it for Next.js Sites.

### Site: bot-api

- **Dockerfile:** `apps/bot-api/Dockerfile.appwrite`
- **Exposed port:** `3001` (Appwrite forwards external traffic)
- **Env template:** `infra/appwrite/bot-api.env.example`

### Site: admin-web

- **Dockerfile:** `apps/admin-web/Dockerfile.appwrite`
- **Exposed port:** `3002`
- **Env template:** `infra/appwrite/admin-web.env.example`

### Site: marketing-site

- **Dockerfile:** `apps/marketing-site/Dockerfile.appwrite`
- **Exposed port:** `3003`
- **Env template:** `infra/appwrite/marketing-site.env.example`

## Required Production Notes

- `BOT_API_BASE_URL`, `ADMIN_WEB_BASE_URL`, and `MARKETING_SITE_BASE_URL` must point to deployed HTTPS domains.
- Set secure values for Telegram and billing webhook secrets.
- Use a production `DATABASE_URL` and run migrations before live webhook traffic.
- Clerk keys are optional in this foundation; configure them only if auth is enabled.

## Suggested Deployment Order

1. Run DB migrations (`pnpm db:migrate:deploy`) against production DB.
2. Deploy `bot-api` and confirm `/health` responds.
3. Deploy `marketing-site` and smoke test auth + checkout redirects.
4. Deploy `admin-web` and verify admin auth and signal pages.

## Post-deploy Checks

- Telegram webhook requests return successful 2xx from the live `bot-api` endpoint.
- Billing webhooks are verified and logged.
- Premium entitlement changes are reflected in channel-access diagnostics.
- Admin and marketing sites can call `bot-api` over HTTPS.
