# Billing Instructions

- Billing state is the source of truth for premium entitlements.
- Never grant or preserve premium access solely because Telegram still shows a membership.
- Grace-period handling must be explicit, time-bounded, and testable.
- Failed payment handling must stage revoke work instead of silently drifting.
- Do not fake provider success when a billing integration is still scaffolded.

