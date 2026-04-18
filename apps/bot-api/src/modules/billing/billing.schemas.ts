import {
  createBillingCheckoutSessionRequestSchema,
  paymongoEventTypeSchema,
  subscriptionPlanIdSchema
} from "@tradara/shared-types";
import { z } from "zod";

export const paymongoWebhookHeadersSchema = z.object({
  "paymongo-signature": z.string().min(1)
});

const paymongoMetadataSchema = z
  .object({
    tradaraUserId: z.string().optional(),
    userId: z.string().optional(),
    tradaraPlanId: subscriptionPlanIdSchema.optional(),
    planId: subscriptionPlanIdSchema.optional(),
    tradaraSubscriptionId: z.string().optional(),
    subscriptionId: z.string().optional()
  })
  .catchall(z.unknown())
  .nullable()
  .optional();

const paymongoPaymentAttributesSchema = z.object({
  status: z.string().optional(),
  paid_at: z.number().nullable().optional(),
  failed_at: z.number().nullable().optional(),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
  payment_intent_id: z.string().nullable().optional(),
  metadata: paymongoMetadataSchema,
  billing: z
    .object({
      email: z.string().email().nullable().optional()
    })
    .nullable()
    .optional()
});

const paymongoCheckoutSessionAttributesSchema = z.object({
  paid_at: z.number().nullable().optional(),
  created_at: z.number().optional(),
  updated_at: z.number().optional(),
  customer_email: z.string().email().nullable().optional(),
  metadata: paymongoMetadataSchema.optional(),
  payment_intent: z
    .object({
      id: z.string(),
      attributes: z
        .object({
          metadata: paymongoMetadataSchema.optional()
        })
        .partial()
        .optional()
    })
    .nullable()
    .optional(),
  payments: z
    .array(
      z.object({
        id: z.string(),
        attributes: paymongoPaymentAttributesSchema
      })
    )
    .optional()
});

const paymongoEventDataResourceSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("checkout_session"),
    attributes: paymongoCheckoutSessionAttributesSchema
  }),
  z.object({
    id: z.string(),
    type: z.literal("payment"),
    attributes: paymongoPaymentAttributesSchema
  })
]);

export const paymongoWebhookPayloadSchema = z.object({
  data: z.object({
    id: z.string(),
    type: z.literal("event"),
    attributes: z.object({
      type: paymongoEventTypeSchema,
      livemode: z.boolean(),
      data: paymongoEventDataResourceSchema,
      previous_data: z.record(z.string(), z.unknown()).optional(),
      pending_webhooks: z.number().optional(),
      created_at: z.number().optional(),
      updated_at: z.number().optional()
    })
  })
});

export const createBillingCheckoutRequestSchema = createBillingCheckoutSessionRequestSchema;

export type PaymongoWebhookPayload = z.infer<typeof paymongoWebhookPayloadSchema>;
