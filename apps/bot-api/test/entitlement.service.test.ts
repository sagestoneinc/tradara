import { describe, expect, it } from "vitest";

import { EntitlementService } from "../src/modules/channel-access/entitlement.service";

describe("EntitlementService", () => {
  it("keeps active subscriptions entitled", () => {
    const service = new EntitlementService(() => new Date("2026-04-18T12:00:00.000Z"));
    const result = service.resolve({
      id: "sub_1",
      userId: "user_1",
      planId: "tradara-pro-monthly",
      status: "active",
      currentPeriodEndsAt: "2026-05-18T12:00:00.000Z",
      gracePeriodEndsAt: null
    });

    expect(result.status).toBe("active");
    expect(result.premiumChannelEligible).toBe(true);
  });

  it("keeps grace-period subscriptions entitled until grace ends", () => {
    const service = new EntitlementService(() => new Date("2026-04-18T12:00:00.000Z"));
    const result = service.resolve({
      id: "sub_2",
      userId: "user_2",
      planId: "tradara-pro-quarterly",
      status: "grace_period",
      currentPeriodEndsAt: "2026-04-17T12:00:00.000Z",
      gracePeriodEndsAt: "2026-04-20T12:00:00.000Z"
    });

    expect(result.status).toBe("grace_period");
    expect(result.premiumChannelEligible).toBe(true);
  });

  it("removes entitlement after the grace period ends", () => {
    const service = new EntitlementService(() => new Date("2026-04-18T12:00:00.000Z"));
    const result = service.resolve({
      id: "sub_3",
      userId: "user_3",
      planId: "tradara-pro-monthly",
      status: "past_due",
      currentPeriodEndsAt: "2026-04-17T12:00:00.000Z",
      gracePeriodEndsAt: "2026-04-18T08:00:00.000Z"
    });

    expect(result.status).toBe("inactive");
    expect(result.premiumChannelEligible).toBe(false);
  });
});

