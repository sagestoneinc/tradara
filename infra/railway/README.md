# Railway Deployment Notes

- `apps/bot-api` is the operational service for webhook intake, entitlement checks, and access reconciliation.
- `apps/admin-web` is the internal control surface for access visibility.
- `apps/marketing-site` is the public-facing site.

This foundation does not include real Railway secrets. Use environment variables from `.env.example` and map them securely per service.

