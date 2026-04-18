export const BOT_MESSAGES = {
  start: `Welcome to Tradara by SageStone Lab.

Guided strategy for smarter trading.

Tradara is a Telegram-first crypto trading guidance platform designed for traders who want more structure, better clarity, and smarter risk awareness.

Here is what you can do here:
- learn how Tradara works
- view available plans
- understand how alerts are structured
- get upgrade information
- access support and FAQs

Important:
Trading involves risk. Losses are possible. Tradara provides market commentary, educational content, and trade ideas only. Past performance does not guarantee future results.

Use:
/plans
/faq
/upgrade
/help`,
  plans: `Tradara Plans

Free
- market updates
- beginner-friendly crypto education
- sample trade ideas
- Tradara announcements

Premium
- structured crypto trade alerts
- entry, stop-loss, and target levels
- AI-assisted market context
- expert-reviewed trade setups
- premium Telegram delivery
- recap and risk-focused updates

VIP
- planned for later expansion
- deeper guidance
- higher-touch support
- premium review experience

If you want the full Tradara experience, Premium is the best place to start.

Use /upgrade to learn how to join.`,
  upgrade: `Upgrade to Tradara Premium

Tradara Premium is built for traders who want:
- structured alerts
- clearer setup logic
- better risk framing
- less noise
- premium Telegram delivery

If billing or access is currently in beta, access may still be handled manually during launch.

Use:
/help
for support
or
/faq
to learn more before joining.`,
  faq: `Tradara FAQ

What is Tradara?
Tradara is a Telegram-first crypto trading guidance platform by SageStone Lab.

Does Tradara auto-trade for me?
No. Tradara does not automatically execute trades. It provides structured trade ideas, market context, and guidance.

Who is Tradara for?
Tradara is designed for traders who want more structure, clearer setups, and better risk awareness - especially beginners and part-time traders.

What do Premium members get?
Premium members receive structured alerts, trade plans, market context, and premium Telegram delivery.

Are results guaranteed?
No. Trading involves risk, and no outcome is guaranteed.

How do I join Premium?
Use /upgrade for the latest access instructions.`,
  help: `Tradara Support

If you need help with:
- understanding how Tradara works
- Premium access
- channel questions
- onboarding
- general support

You can also use:
 /plans
 /faq
 /upgrade

If you are in beta access, some support and onboarding steps may still be handled manually.`,
  risk: `Tradara Risk Guidance

Good trading starts with good risk management.

Core rules:
- never risk more than you can afford to lose
- avoid over-leverage
- do not chase missed entries
- use stop-loss levels with discipline
- focus on consistency over emotion

Tradara provides structured trade ideas, but every member remains responsible for their own execution and risk decisions.`,
  alerts: `About Tradara Alerts

Tradara alerts are designed to provide structured trade guidance, not random market calls.

A typical alert includes:
- pair
- direction
- entry zone
- stop-loss
- take-profit targets
- setup rationale
- invalidation condition
- risk note

This helps traders make more disciplined decisions with clearer context.`,
  status: `Membership Status

Your Tradara membership and access details will appear here as the platform continues to roll out billing and access automation.

If you already joined Premium and need help confirming access, please use /help.`
} as const;

export const FALLBACK_MESSAGE = `I didn't understand that command.

Try one of these:
/start
/plans
/upgrade
/faq
/help
/risk
/alerts
/status`;
