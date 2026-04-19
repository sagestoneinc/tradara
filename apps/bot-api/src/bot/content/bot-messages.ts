export const BITXEX_REGISTRATION_URL = "https://xex1112gsa.sbs/register/GbSMuMyw";

export const BOT_TELEGRAM_OPTIONS = {
  parse_mode: "Markdown",
  disable_web_page_preview: true
} as const;

export const BOT_MESSAGES = {
  start: `👋 *Welcome to Tradara*
_by SageStone Lab_

🎯 *Guided strategy for smarter trading.*

Tradara is a Telegram-first crypto trading guidance platform built for traders who want:

• clearer setups
• structured entries and exits
• AI-assisted market context
• expert-reviewed trade ideas
• better risk awareness

Here’s what you can do:

📘 \`/plans\` — View Tradara plans
🚀 \`/upgrade\` — Join Premium
❓ \`/faq\` — Common questions
🛟 \`/help\` — Support
⚠️ \`/risk\` — Risk guidance
📡 \`/alerts\` — How Tradara alerts work

_Trading involves risk. Losses are possible. Tradara provides market commentary, educational content, and trade ideas only. Past performance does not guarantee future results._`,
  plans: `📦 *Tradara Plans*

🆓 *Free*
• market updates
• beginner-friendly crypto education
• sample trade ideas
• Tradara announcements

💎 *Premium*
• structured crypto trade alerts
• entry, stop-loss, and target levels
• AI-assisted market context
• expert-reviewed trade setups
• premium Telegram delivery
• recap and risk-focused updates

👑 *VIP*
• planned for future expansion
• deeper guidance
• higher-touch support
• premium review experience

👉 If you want the full Tradara experience, *Premium* is the best place to start.

Use \`/upgrade\` to learn how to join.`,
  upgrade: `🚀 *Upgrade to Tradara Premium*

Tradara Premium is built for traders who want:

• structured alerts
• clearer setup logic
• better risk framing
• less noise
• premium Telegram delivery

💳 If billing or access is still in beta, some onboarding steps may be handled manually during launch.

🏦 *Need an exchange?*
Most of our trading signal strategies are structured around *BitxEX*.

🔗 ${BITXEX_REGISTRATION_URL}

Use:
🛟 \`/help\` for support
❓ \`/faq\` to learn more before joining`,
  faq: `❓ *Tradara FAQ*

*What is Tradara?*
Tradara is a Telegram-first crypto trading guidance platform by SageStone Lab.

*Does Tradara auto-trade for me?*
No. Tradara does not automatically execute trades. It provides structured trade ideas, market context, and guidance.

*Who is Tradara for?*
Tradara is designed for traders who want more structure, clearer setups, and better risk awareness, especially beginners and part-time traders.

*What do Premium members get?*
Premium members receive structured alerts, trade plans, market context, and premium Telegram delivery.

*Are results guaranteed?*
No. Trading involves risk, and no outcome is guaranteed.

*How do I join Premium?*
Use \`/upgrade\` for the latest access instructions.`,
  help: `🛟 *Tradara Support*

Need help with:

• how Tradara works
• Premium access
• channel questions
• onboarding
• general support

You can also use:

📘 \`/plans\`
❓ \`/faq\`
🚀 \`/upgrade\`

_If you are joining during beta, some support and onboarding steps may still be handled manually._`,
  risk: `⚠️ *Tradara Risk Guidance*

Good trading starts with good risk management.

Core rules:

• never risk more than you can afford to lose
• avoid over-leverage
• do not chase missed entries
• use stop-loss levels with discipline
• focus on consistency over emotion

📌 Tradara provides structured trade ideas, but every member remains responsible for their own execution and risk decisions.`,
  alerts: `📡 *About Tradara Alerts*

Tradara alerts are designed to provide *structured trade guidance*, not random market calls.

A typical alert includes:

• pair
• direction
• entry zone
• stop-loss
• take-profit targets
• setup rationale
• invalidation condition
• risk note

🧠 Many alerts may also include AI-assisted context and expert review notes to help traders make clearer decisions.`,
  status: `📋 *Membership Status*

Your Tradara membership and access details will appear here as billing and access automation continue rolling out.

If you already joined Premium and need help confirming access, use \`/help\`.`,
  freeChannelPinnedResources: `📌 *Tradara Resources*

To get the most out of Tradara, make sure your trading setup is ready.

Most of our trading signal strategies are structured around *BitxEX*, so using the same execution environment can help you follow entries, stop-loss levels, and target structure more smoothly.

🔗 *Create your BitxEX account here:*
${BITXEX_REGISTRATION_URL}

Once you’re set up, review the pinned posts so you understand:
• how Tradara signals work
• how to manage risk
• how to follow entries, stops, and targets

⚠️ Always use proper risk management and only trade with funds you can afford to lose.`,
  bitxexReminder: `🚀 *Quick Reminder*

If you haven’t signed up for *BitxEX* yet, now is a good time to get your setup ready.

Most of our trading signal strategies are built around *BitxEX*, which can make it easier to follow Tradara entries, stops, and target structure consistently.

🔗 *Sign up here:*
${BITXEX_REGISTRATION_URL}`
} as const;

export function buildUpgradeMessage(marketingSiteBaseUrl: string): string {
  const billingUrl = `${marketingSiteBaseUrl.replace(/\/$/, "")}/account/billing`;

  return `🚀 *Upgrade to Tradara Premium*

Tradara Premium is built for traders who want:

• structured alerts
• clearer setup logic
• better risk framing
• less noise
• premium Telegram delivery

🌐 *Start from your Tradara account:*
${billingUrl}

💳 Billing stays the source of truth for access, and Telegram remains the delivery layer.

🏦 *Need an exchange?*
Most of our trading signal strategies are structured around *BitxEX*.

🔗 ${BITXEX_REGISTRATION_URL}

Use:
🛟 \`/help\` for support
❓ \`/faq\` to learn more before joining`;
}

export const TELEGRAM_LINK_MESSAGES = {
  linked: `✅ *Telegram linked successfully*

Your Tradara account is now connected to this Telegram profile.

If your billing is already active, access will move through the normal reconciliation flow shortly.`,
  linkedPendingBilling: `✅ *Telegram linked successfully*

Your Tradara account is connected, but premium access is still waiting on an active billing entitlement.

Open your Tradara account to finish checkout when you're ready.`,
  expired: `⌛ *That Telegram link expired*

Open your Tradara account and create a fresh Telegram linking session, then try again.`,
  invalid: `⚠️ *That Telegram link is not valid*

Please start the linking flow again from your Tradara account.`,
  alreadyLinked: `✅ *This Telegram link was already used*

Your Tradara account is already connected to Telegram.`
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
