import { z } from "zod";

export const clerkUserEmailAddressSchema = z.object({
  id: z.string(),
  email_address: z.string().email()
});

export const clerkUserWebhookDataSchema = z
  .object({
    id: z.string(),
    first_name: z.string().nullable().optional(),
    last_name: z.string().nullable().optional(),
    username: z.string().nullable().optional(),
    primary_email_address_id: z.string().nullable().optional(),
    email_addresses: z.array(clerkUserEmailAddressSchema).default([])
  })
  .passthrough();

export const clerkDeletedWebhookDataSchema = z
  .object({
    id: z.string()
  })
  .passthrough();

export const clerkSessionWebhookDataSchema = z
  .object({
    id: z.string(),
    user_id: z.string()
  })
  .passthrough();

export const clerkWebhookPayloadSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.enum(["user.created", "user.updated"]),
    data: clerkUserWebhookDataSchema
  }),
  z.object({
    type: z.enum(["user.deleted"]),
    data: clerkDeletedWebhookDataSchema
  }),
  z.object({
    type: z.enum(["session.created"]),
    data: clerkSessionWebhookDataSchema
  })
]);

export const authorizationHeaderSchema = z.object({
  authorization: z.string().min(1)
});
