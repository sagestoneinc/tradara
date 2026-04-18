import { telegramInviteRequestSchema } from "@tradara/shared-types";
import { z } from "zod";

export const userIdParamsSchema = z.object({
  userId: z.string().min(1)
});

export const reconcileRequestSchema = z.object({
  reason: z.string().min(1).default("Manual reconciliation requested by admin")
});

export const inviteLinkBodySchema = telegramInviteRequestSchema;

