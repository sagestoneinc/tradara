import type { BotApiEnv } from "@tradara/shared-config";
import type { AuditLog, TelegramLinkState, UserSnapshot } from "@tradara/shared-types";
import { createId, isoNow } from "@tradara/shared-utils";

import { DomainError } from "../../lib/domain-error";
import { parseInput } from "../../lib/zod";
import type { AuditLogRepository, UserRepository } from "../../repositories/types";
import { authorizationHeaderSchema, clerkWebhookPayloadSchema } from "./auth.schemas";
import type { ClerkVerifier } from "./clerk-verifier";

function buildDisplayName(input: {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  email?: string | null;
  existingDisplayName?: string | null;
  fallbackId: string;
}): string {
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim();

  return (
    fullName ||
    input.username ||
    input.existingDisplayName ||
    input.email ||
    `Tradara member ${input.fallbackId.slice(0, 8)}`
  );
}

function extractPrimaryEmail(data: {
  primary_email_address_id?: string | null;
  email_addresses?: Array<{ id: string; email_address: string }>;
}): string | null {
  const primary =
    data.primary_email_address_id && data.email_addresses
      ? data.email_addresses.find((email) => email.id === data.primary_email_address_id)
      : null;

  return primary?.email_address ?? data.email_addresses?.[0]?.email_address ?? null;
}

export class ClerkAuthService {
  constructor(
    private readonly env: BotApiEnv,
    private readonly userRepository: UserRepository,
    private readonly auditLogRepository: AuditLogRepository,
    private readonly verifier: ClerkVerifier,
    private readonly clock: () => Date = () => new Date()
  ) {}

  async handleWebhook(input: {
    rawBody: string;
    headers: Record<string, string | string[] | undefined>;
  }): Promise<{ type: string; clerkUserId: string | null; internalUserId: string | null }> {
    const verified = await this.verifier.verifyWebhook(input.rawBody, input.headers);
    const event = parseInput(clerkWebhookPayloadSchema, verified);

    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const clerkUserId = event.data.id;
        const email = extractPrimaryEmail(event.data);
        const user = await this.resolveOrCreateUser({
          clerkUserId,
          email,
          displayName: buildDisplayName({
            firstName: event.data.first_name,
            lastName: event.data.last_name,
            username: event.data.username,
            email,
            fallbackId: clerkUserId
          })
        });

        await this.appendAuditLog({
          actorType: "webhook",
          actorId: "clerk",
          action: `identity.clerk.${event.type.replace(".", "_")}`,
          entityType: "user",
          entityId: user.id,
          metadata: {
            userId: user.id,
            clerkUserId,
            email
          }
        });

        return {
          type: event.type,
          clerkUserId,
          internalUserId: user.id
        };
      }
      case "user.deleted": {
        const existing = await this.userRepository.findByClerkUserId(event.data.id);
        if (existing) {
          await this.userRepository.save({
            ...existing,
            clerkUserId: null
          });

          await this.appendAuditLog({
            actorType: "webhook",
            actorId: "clerk",
            action: "identity.clerk.user_deleted",
            entityType: "user",
            entityId: existing.id,
            metadata: {
              userId: existing.id,
              clerkUserId: event.data.id
            }
          });
        }

        return {
          type: event.type,
          clerkUserId: event.data.id,
          internalUserId: existing?.id ?? null
        };
      }
      case "session.created": {
        const existing = await this.userRepository.findByClerkUserId(event.data.user_id);
        if (existing) {
          await this.userRepository.save({
            ...existing,
            lastLoginAt: isoNow(this.clock())
          });

          await this.appendAuditLog({
            actorType: "webhook",
            actorId: "clerk",
            action: "identity.clerk.session_created",
            entityType: "user",
            entityId: existing.id,
            metadata: {
              userId: existing.id,
              clerkUserId: event.data.user_id
            }
          });
        }

        return {
          type: event.type,
          clerkUserId: event.data.user_id,
          internalUserId: existing?.id ?? null
        };
      }
    }
  }

  async requireAuthenticatedUser(
    headers: Record<string, string | string[] | undefined>
  ): Promise<UserSnapshot> {
    const { authorization } = parseInput(authorizationHeaderSchema, headers);
    const token = this.extractBearerToken(authorization);
    const claims = await this.verifier.verifySessionToken(token);

    return this.resolveOrCreateUser({
      clerkUserId: claims.sub,
      email: claims.email ?? null
    });
  }

  private extractBearerToken(authorization: string): string {
    if (!authorization.startsWith("Bearer ")) {
      throw new DomainError(
        "A Clerk bearer token is required.",
        401,
        "clerk_bearer_token_missing"
      );
    }

    const token = authorization.slice("Bearer ".length).trim();
    if (!token) {
      throw new DomainError(
        "A Clerk bearer token is required.",
        401,
        "clerk_bearer_token_missing"
      );
    }

    return token;
  }

  private async resolveOrCreateUser(input: {
    clerkUserId: string;
    email?: string | null;
    displayName?: string | null;
  }): Promise<UserSnapshot> {
    const byClerk = await this.userRepository.findByClerkUserId(input.clerkUserId);
    if (byClerk) {
      const updated: UserSnapshot = {
        ...byClerk,
        email: input.email ?? byClerk.email,
        displayName:
          input.displayName ??
          buildDisplayName({
            email: input.email ?? byClerk.email,
            existingDisplayName: byClerk.displayName,
            fallbackId: byClerk.id
          }),
        lastLoginAt: isoNow(this.clock())
      };
      await this.userRepository.save(updated);
      return updated;
    }

    const byEmail = input.email ? await this.userRepository.findByEmail(input.email) : null;
    if (byEmail) {
      const telegramLinkState: TelegramLinkState =
        byEmail.telegramLinkState ?? (byEmail.telegramUserId ? "linked" : "unlinked");
      const updated: UserSnapshot = {
        ...byEmail,
        clerkUserId: input.clerkUserId,
        displayName:
          input.displayName ??
          buildDisplayName({
            email: input.email,
            existingDisplayName: byEmail.displayName,
            fallbackId: byEmail.id
          }),
        telegramLinkState,
        telegramLinkedAt: byEmail.telegramLinkedAt ?? null,
        lastLoginAt: isoNow(this.clock())
      };
      await this.userRepository.save(updated);
      return updated;
    }

    const id = `clerk_${input.clerkUserId}`;
    const created: UserSnapshot = {
      id,
      displayName:
        input.displayName ??
        buildDisplayName({
          email: input.email,
          fallbackId: id
        }),
      email: input.email?.toLowerCase() ?? null,
      clerkUserId: input.clerkUserId,
      telegramHandle: null,
      telegramUserId: null,
      telegramLinkState: "unlinked",
      telegramLinkedAt: null,
      lastLoginAt: isoNow(this.clock()),
      createdAt: isoNow(this.clock()),
      updatedAt: isoNow(this.clock())
    };
    await this.userRepository.save(created);
    return created;
  }

  private async appendAuditLog(input: {
    actorType: AuditLog["actorType"];
    actorId: string;
    action: string;
    entityType: string;
    entityId: string;
    metadata: Record<string, unknown>;
  }): Promise<void> {
    await this.auditLogRepository.append({
      id: createId("audit"),
      actorType: input.actorType,
      actorId: input.actorId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata,
      createdAt: isoNow(this.clock())
    });
  }
}
