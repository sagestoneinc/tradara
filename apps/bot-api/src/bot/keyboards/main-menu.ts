export const MAIN_MENU_KEYBOARD = {
  reply_markup: {
    keyboard: [
      [{ text: "/plans" }, { text: "/upgrade" }],
      [{ text: "/faq" }, { text: "/help" }],
      [{ text: "/risk" }, { text: "/alerts" }],
      [{ text: "/status" }]
    ],
    resize_keyboard: true,
    is_persistent: true
  }
} as const;
