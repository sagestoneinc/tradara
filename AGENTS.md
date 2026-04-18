# Tradara Agent Guidance

## Product Boundaries

- Tradara is a Telegram-first crypto trading guidance platform.
- It is not an auto-trading or execution bot.
- Billing state is the source of truth for premium entitlements.
- Telegram is a delivery layer and must remain revocable.

## Engineering Rules

- Never bypass webhook verification.
- Validate inbound provider payloads with Zod.
- Use modular services instead of embedding business rules in routes.
- Keep critical flows testable.
- Do not claim production readiness for stubbed provider integrations.
- Protect secrets and keep them out of source control.

## Workflow Expectations

- Use a Superpowers-style planning and verification mindset for multi-step implementation.
- Use UI/UX Pro Max-style consistency and accessibility thinking for admin and marketing UI work.
- Prefer small, reviewable changes over broad refactors.

