# Security Instructions

- Never bypass webhook signature or secret verification.
- Record webhook events idempotently and treat duplicates safely.
- Keep secrets in environment configuration only.
- Avoid logging raw secrets or sensitive user identifiers unnecessarily.
- Do not treat unverified Telegram updates as trustworthy.

