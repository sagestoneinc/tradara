# TRADARA Monorepo (by SageStone Lab)

Trade smarter. Grow faster.

TRADARA is a Telegram-first crypto trading guidance platform with a premium marketing web experience, an internal admin app, and a bot API for entitlement-aware delivery workflows.

## Product Overview

- **Marketing site (`apps/marketing-site`)**: public website for acquisition, education, SEO, and conversion.
- **Admin web (`apps/admin-web`)**: internal operations for diagnostics, signal workflows, and access visibility.
- **Bot API (`apps/bot-api`)**: webhook intake, billing/entitlement orchestration, and Telegram delivery controls.

## Tech Stack

- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: Next.js App Router + React + Tailwind CSS v4
- **Backend**: Fastify + TypeScript + Zod
- **Data**: Prisma schema under `infra/supabase/prisma`
- **Testing**: Vitest

## Folder Structure

- `apps/marketing-site`: TRADARA branded public website
- `apps/admin-web`: internal admin interface
- `apps/bot-api`: API service and Telegram/billing integrations
- `packages/*`: shared UI, types, config, and utilities
- `infra/supabase`: Prisma schema + migrations
- `infra/appwrite`: legacy Appwrite deployment references
- `docs/`: architecture and compliance documentation
- `qa/`: smoke plans and API collections

## Scripts

From repository root:

- `pnpm dev` – run workspace apps in development mode
- `pnpm build` – run turbo build across workspaces
- `pnpm lint` – run lint checks across workspaces
- `pnpm typecheck` – run TypeScript checks across workspaces
- `pnpm test` – run tests across workspaces

## Local Development

1. Copy `.env.example` to `.env` and populate values.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start apps:
   ```bash
   pnpm dev
   ```

Marketing site default dev port is `3003`.

## Environment Variables

Use `.env.example` as the source of truth for required variables.

Important variables for marketing deployment:

- `MARKETING_SITE_BASE_URL`
- `BOT_API_BASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

## Vercel Deployment (Recommended)

Deploy each Next.js app as a separate Vercel project:

1. Connect the monorepo to Vercel.
2. Create one project per app (e.g. marketing site and admin app).
3. Set root directory to the specific app folder (e.g. `apps/marketing-site`).
4. Build command: `pnpm build`
5. Install command: `pnpm install --frozen-lockfile`
6. Configure required environment variables per project.

Bot API can be deployed separately to your preferred runtime.

## SEO Notes (Marketing Site)

The marketing site includes:

- route-level metadata per page
- Open Graph and Twitter cards
- canonical URLs
- `robots.ts` and `sitemap.ts`
- Organization/WebSite/SoftwareApplication/FAQ JSON-LD
- semantic headings and accessible link/button labels

## Brand System Summary

TRADARA marketing UI follows a dark fintech aesthetic:

- Primary: `#00E5A8`, `#1E90FF`
- Secondary: `#0A0F1C`, `#101828`
- Accent: `#00F0FF`, `#22C55E`
- Typography: Inter + Poppins
- Reusable UI patterns: gradient CTAs, glass cards, soft glow borders, high-contrast content

## Compliance & Risk Language

TRADARA messaging avoids guaranteed-return claims.

Required disclaimer pattern:

> Crypto trading involves risk. TRADARA does not guarantee profits or eliminate losses. Users are responsible for their own trading decisions and should only trade what they can afford to lose.
