import { describe, expect, it } from "vitest";
import { loadBotApiEnv } from "@tradara/shared-config";
import type { SubscriptionSnapshot } from "@tradara/shared-types";

import {
  InMemoryAuditLogRepository,
  InMemoryChannelAccessRepository,
  InMemorySubscriptionRepository,
  InMemoryUserRepository
} from "../src/repositories/in-memory-repositories";
import { AccountService } from "../src/modules/auth/account.service";
import { ClerkAuthService } from "../src/modules/auth/clerk-auth.service";
import type { ClerkVerifier } from "../src/modules/auth/clerk-verifier";
import { EntitlementService } from "../src/modules/channel-access/entitlement.service";
import { DomainError } from "../src/lib/domain-error";

const env = loadBotApiEnv({
  NODE_ENV: "test",
  BOT_API_PORT: "3001",
  BOT_API_BASE_URL: "http://localhost:3001",
  DATABASE_URL: "postgresql://postgres:postgres@localhost:54322/postgres",
  CLERK_SECRET_KEY: "sk_test_mock",
  CLERK_WEBHOOK_SECRET: "whsec_mock",
  TELEGRAM_BOT_TOKEN: "token",
  TELEGRAM_WEBHOOK_SECRET: "telegram-secret",
  TELEGRAM_PREMIUM_CHANNEL_ID: "-1000001",
  TELEGRAM_BOT_USERNAME: "tradara_bot",
  PAYMONGO_WEBHOOK_SECRET: "paymongo-secret",
  ACCESS_GRACE_PERIOD_HOURS: "72"
});

function createFakeClerkVerifier(): ClerkVerifier {
  return {
    async verifyWebhook() {
      return {
        type: "user.created",
        data: {
          id: "user_clerk_123",
          first_name: "Jesse",
          last_name: "Cura",
          primary_email_address_id: "em_1",
          email_addresses: [{ id: "em_1", email_address: "jesse@example.com" }]
        }
      };
    },
    async verifySessionToken(token) {
      if (token !== "valid-token") {
        throw new DomainError("Invalid Clerk session.", 401, "clerk_session_verification_failed");
      }

      return {
        sub: "user_clerk_123",
        email: "jesse@example.com"
      };
    }
  };
}

describe("Clerk identity foundation services", () => {
  it("syncs a Clerk user from a verified webhook and stores an audit trail", async () => {
    const userRepository = new InMemoryUserRepository();
    const auditLogRepository = new InMemoryAuditLogRepository();
    const service = new ClerkAuthService(
      env,
      userRepository,
      auditLogRepository,
      createFakeClerkVerifier(),
      () => new Date("2026-04-19T12:00:00.000Z")
    );

    const result = await service.handleWebhook({
      rawBody: JSON.stringify({ ignored: true }),
      headers: {
        "svix-id": "msg_123",
        "svix-timestamp": "1713500000",
        "svix-signature": "v1,mock"
      }
    });

    const user = await userRepository.findByClerkUserId("user_clerk_123");
    const logs = await auditLogRepository.listRecent(5);

    expect(result.type).toBe("user.created");
    expect(user?.id).toBe("clerk_user_clerk_123");
    expect(user?.displayName).toBe("Jesse Cura");
    expect(user?.email).toBe("jesse@example.com");
    expect(logs[0]?.action).toBe("identity.clerk.user_created");
  });

  it("returns an account access snapshot backed by internal billing truth", async () => {
    const userRepository = new InMemoryUserRepository([
      {
        id: "clerk_user_clerk_123",
        displayName: "Jesse Cura",
        email: "jesse@example.com",
        clerkUserId: "user_clerk_123",
        telegramHandle: null,
        telegramUserId: null,
        telegramLinkState: "unlinked",
        telegramLinkedAt: null,
        lastLoginAt: null,
        createdAt: "2026-04-19T10:00:00.000Z",
        updatedAt: "2026-04-19T10:00:00.000Z"
      }
    ]);
    const auditLogRepository = new InMemoryAuditLogRepository();
    const authService = new ClerkAuthService(
      env,
      userRepository,
      auditLogRepository,
      createFakeClerkVerifier(),
      () => new Date("2026-04-19T12:00:00.000Z")
    );
    const subscriptions: SubscriptionSnapshot[] = [
      {
        id: "sub_clerk_001",
        userId: "clerk_user_clerk_123",
        planId: "tradara-pro-monthly",
        status: "active",
        currentPeriodEndsAt: "2026-05-01T00:00:00.000Z",
        gracePeriodEndsAt: null
      }
    ];
    const accountService = new AccountService(
      authService,
      new InMemorySubscriptionRepository(subscriptions),
      new InMemoryChannelAccessRepository(),
      new EntitlementService(() => new Date("2026-04-19T12:00:00.000Z"))
    );

    const snapshot = await accountService.getAccess({
      authorization: "Bearer valid-token"
    });

    expect(snapshot.user.id).toBe("clerk_user_clerk_123");
    expect(snapshot.subscription?.id).toBe("sub_clerk_001");
    expect(snapshot.entitlement.status).toBe("active");
    expect(snapshot.checklist.hasBilling).toBe(true);
    expect(snapshot.checklist.telegramLinked).toBe(false);
    expect(snapshot.checklist.premiumAccessReady).toBe(false);
  });

  it("rejects account resolution when the bearer token is invalid", async () => {
    const service = new ClerkAuthService(
      env,
      new InMemoryUserRepository(),
      new InMemoryAuditLogRepository(),
      createFakeClerkVerifier(),
      () => new Date("2026-04-19T12:00:00.000Z")
    );

    await expect(
      service.requireAuthenticatedUser({
        authorization: "Bearer wrong-token"
      })
    ).rejects.toMatchObject({
      statusCode: 401,
      code: "clerk_session_verification_failed"
    });
  });
});
