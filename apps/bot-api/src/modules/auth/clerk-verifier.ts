import { verifyToken } from "@clerk/backend";
import { verifyWebhook } from "@clerk/backend/webhooks";
import type { BotApiEnv } from "@tradara/shared-config";

import { DomainError } from "../../lib/domain-error";

export interface ClerkSessionClaims {
  sub: string;
  email?: string | null;
}

export interface ClerkVerifier {
  verifyWebhook(rawBody: string, headers: Record<string, string | string[] | undefined>): Promise<unknown>;
  verifySessionToken(token: string): Promise<ClerkSessionClaims>;
}

function normalizeHeaders(headers: Record<string, string | string[] | undefined>): Headers {
  const normalized = new Headers();
  for (const [key, value] of Object.entries(headers)) {
    if (Array.isArray(value)) {
      normalized.set(key, value.join(", "));
      continue;
    }

    if (value !== undefined) {
      normalized.set(key, value);
    }
  }

  return normalized;
}

export class ClerkBackendVerifier implements ClerkVerifier {
  constructor(private readonly env: BotApiEnv) {}

  async verifyWebhook(
    rawBody: string,
    headers: Record<string, string | string[] | undefined>
  ): Promise<unknown> {
    if (!this.env.CLERK_WEBHOOK_SECRET) {
      throw new DomainError(
        "Clerk webhook signing secret is not configured.",
        503,
        "clerk_webhook_not_configured"
      );
    }

    try {
      return await verifyWebhook(
        new Request("http://tradara.local/v1/auth/clerk/webhooks", {
          method: "POST",
          headers: normalizeHeaders(headers),
          body: rawBody
        }),
        {
          signingSecret: this.env.CLERK_WEBHOOK_SECRET
        }
      );
    } catch (error) {
      throw new DomainError(
        "Clerk webhook verification failed.",
        401,
        "clerk_webhook_verification_failed",
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      );
    }
  }

  async verifySessionToken(token: string): Promise<ClerkSessionClaims> {
    if (!this.env.CLERK_SECRET_KEY) {
      throw new DomainError(
        "Clerk secret key is not configured.",
        503,
        "clerk_secret_not_configured"
      );
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: this.env.CLERK_SECRET_KEY
      });

      return {
        sub: payload.sub,
        email:
          typeof payload.email === "string"
            ? payload.email
            : typeof payload.email_address === "string"
              ? payload.email_address
              : null
      };
    } catch (error) {
      throw new DomainError(
        "Clerk session verification failed.",
        401,
        "clerk_session_verification_failed",
        {
          message: error instanceof Error ? error.message : "Unknown error"
        }
      );
    }
  }
}
