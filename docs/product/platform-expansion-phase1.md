# Tradara Platform Expansion (Phase 1)

## Vision

Tradara is evolving into a Telegram-first, AI-assisted crypto learning and guidance platform focused on:

- Learn
- Practice
- Analyze
- Guidance
- Improve

Tradara remains **education-first** and **risk-first**:

> Educational guidance only. Crypto trading is risky and losses can occur. No setup is guaranteed.

## Backward Compatibility Guardrails

The following existing systems are preserved:

- Telegram webhook verification and idempotency
- Billing and entitlement source-of-truth behavior
- Premium access grant/revoke and reconciliation flows
- Existing admin access workflows
- Existing signal ingestion/review/publish routes
- Existing public marketing pages and legal routes

## Phase 1 Scope Delivered

- Additive database schema and migration scaffolding for onboarding, learn, practice, trade ideas, journal, and risk disclosure acceptance.
- Additive bot commands for beginner journey support (`/learn`, `/pulse`, `/signals`, `/explain`, `/practice`, `/journal`, `/account`).
- Additive platform API scaffolding (`/v1/onboarding`, `/v1/learn/paths`, `/v1/market-pulse`, `/v1/trade-ideas`, `/v1/practice/trades`, `/v1/journal/entries`).
- Marketing positioning updates and new Trust & Safety page.
- Admin command-center scaffolding entries for analyst desk, education CMS, risk flags, and compliance.

## Deferred to Next Phases

- Persistent repository-backed implementation for all new API scaffolds
- Full onboarding wizard in a dedicated user web-app
- Analyst review CRUD + outcomes surfaced in admin tables
- AI coach inference endpoint and prompt execution runtime integration
- Practice portfolio accounting and replay engine
- Full test coverage for all advanced workflows
