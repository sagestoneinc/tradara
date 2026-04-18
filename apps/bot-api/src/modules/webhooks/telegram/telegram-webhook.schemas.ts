import { z } from "zod";

const chatSchema = z.object({
  id: z.union([z.string(), z.number()]).transform(String),
  type: z.string()
});

const chatMemberStatusSchema = z.object({
  status: z.string(),
  user: z
    .object({
      id: z.union([z.number(), z.string()]).transform(String)
    })
    .optional()
});

const chatMemberUpdateSchema = z.object({
  chat: chatSchema,
  date: z.number().optional(),
  old_chat_member: chatMemberStatusSchema,
  new_chat_member: chatMemberStatusSchema
});

export const telegramWebhookHeadersSchema = z.object({
  "x-telegram-bot-api-secret-token": z.string().min(1)
});

export const telegramWebhookPayloadSchema = z.object({
  update_id: z.union([z.number(), z.string()]).transform(String),
  chat_member: chatMemberUpdateSchema.optional(),
  my_chat_member: chatMemberUpdateSchema.optional()
});

export type TelegramWebhookPayload = z.infer<typeof telegramWebhookPayloadSchema>;

