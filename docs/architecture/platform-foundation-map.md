# Platform Foundation Architecture Map (Phase 1)

## Existing Apps

- `apps/bot-api`: webhook handling, billing, entitlements, channel access, signal workflow
- `apps/admin-web`: operations dashboard and signal/admin views
- `apps/marketing-site`: public website and legal pages

## New Additive Foundations

- **Data model**: onboarding, learning, glossary, practice, trade ideas, journal, watchlist, risk acceptance
- **Bot surface**: expanded command vocabulary for education/practice/guidance
- **API scaffold**: onboarding + learn/practice/journal/trade-ideas starter routes
- **Admin scaffold**: analyst desk / education cms / risk flags / compliance sections
- **Trust surface**: dedicated Trust & Safety page on marketing site

## Compatibility Notes

- No destructive table or enum changes
- Existing route shapes unchanged
- Existing webhook security untouched
- Existing entitlement authority untouched
- Existing signal pipeline untouched
