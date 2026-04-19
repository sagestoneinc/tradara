import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import { parseInput } from "../../lib/zod";
import { createBillingCheckoutRequestSchema } from "./billing.schemas";
import type { BillingService } from "./billing.service";

export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  createCheckoutSession = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = parseInput(createBillingCheckoutRequestSchema, request.body);
    const result = await this.billingService.createCheckoutSession(body);
    reply.status(202).send(ok(result));
  };

  handleWebhook = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const provider = (request.params as Record<string, string>).provider;

    if (!provider || !["paypal", "xendit", "paymongo"].includes(provider)) {
      reply.status(400).send({ error: "Invalid payment provider" });
      return;
    }

    const headerRecord: Record<string, string> = {};
    for (const [key, value] of Object.entries(request.headers)) {
      if (typeof value === "string") {
        headerRecord[key] = value;
      }
    }

    const result = await this.billingService.handleWebhook({
      provider,
      headers: headerRecord,
      rawBody: request.rawBody || "",
      payload: request.body as Record<string, unknown>
    });

    reply.status(result.duplicate ? 200 : 202).send(ok(result));
  };
}
