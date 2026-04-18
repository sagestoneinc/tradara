# Tradara by SageStone Lab

Tradara is a Telegram-first crypto trading guidance platform with premium subscription access, AI-assisted signal workflows, analyst review, and revocable premium-channel delivery.

## This Repository

This foundation currently focuses on Telegram premium access control:

- billing-derived entitlement checks
- premium access grant and revoke scaffolding
- Telegram webhook verification and idempotent event logging
- reconciliation job design
- admin visibility for access state

## Workspace Layout

- `apps/bot-api`: Fastify API for webhook intake, entitlement checks, and access workflows
- `apps/admin-web`: Next.js internal admin shell for access visibility
- `apps/marketing-site`: Next.js public site placeholder
- `packages/*`: shared types, config, utils, UI primitives, and prompts
- `infra/supabase`: Prisma schema and migration foundation
- `docs`: architecture, flow, and compliance notes

## Quick Start

1. Copy `.env.example` to `.env` and fill in local values.
2. Run `pnpm install`.
3. Run `pnpm test` for the current access-control tests.
4. Run `pnpm dev` to start the workspace apps.

## Guardrails

- Billing remains the source of truth for premium access.
- Telegram is delivery only.
- All inbound external data must be validated and logged.
- No fake production readiness claims for stubbed integrations.

