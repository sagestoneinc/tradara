import type { FastifyReply, FastifyRequest } from "fastify";
import { ok } from "@tradara/shared-utils";

import type { AccountService } from "./account.service";
import type { ClerkAuthService } from "./clerk-auth.service";

export class AuthController {
  constructor(
    private readonly clerkAuthService: ClerkAuthService,
    private readonly accountService: AccountService
  ) {}

  handleClerkWebhook = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const result = await this.clerkAuthService.handleWebhook({
      rawBody: request.rawBody ?? "",
      headers: request.headers
    });

    reply.status(202).send(ok(result));
  };

  getAccountProfile = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.accountService.getProfile(request.headers)));
  };

  getAccountAccess = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    reply.send(ok(await this.accountService.getAccess(request.headers)));
  };
}
