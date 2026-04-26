export const MAIN_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: "/learn" }, { text: "/pulse" }],
      [{ text: "/signals" }, { text: "/practice" }],
      [{ text: "/journal" }, { text: "/explain" }],
      [{ text: "/plans" }, { text: "/upgrade" }],
      [{ text: "/risk" }, { text: "/account" }],
      [{ text: "/faq" }, { text: "/help" }, { text: "/status" }]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
} as const;
