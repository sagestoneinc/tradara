# Channel Access Flow

1. Billing updates the subscription state.
2. Entitlement is derived from that billing state.
3. If entitlement grants premium access, a channel-access record can move toward `pending_grant`.
4. A Telegram invite link may be requested through the adapter boundary.
5. Telegram webhook updates are validated and logged.
6. Membership observations update delivery status only.
7. Reconciliation compares entitlement with observed state and stages grant or revoke actions.

