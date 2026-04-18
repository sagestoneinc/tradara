import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import { parseInput } from "../../lib/zod";
import {
  createBillingCheckoutRequestSchema,
  paymongoWebhookHeadersSchema,
  paymongoWebhookPayloadSchema
} from "./billing.schemas";
import type { BillingService } from "./billing.service";

export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  createCheckoutScaffold = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const body = parseInput(createBillingCheckoutRequestSchema, request.body);
    const result = await this.billingService.createCheckoutSessionScaffold(body);
    reply.status(202).send(ok(result));
  };

  handlePaymongoWebhook = async (
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> => {
    const headers = parseInput(paymongoWebhookHeadersSchema, request.headers);
    const payload = parseInput(paymongoWebhookPayloadSchema, request.body);
    const result = await this.billingService.handleWebhook({
      signatureHeader: headers["paymongo-signature"],
      rawBody: request.rawBody,
      payload
    });

    reply.status(result.duplicate ? 200 : 202).send(ok(result));
  };
}
