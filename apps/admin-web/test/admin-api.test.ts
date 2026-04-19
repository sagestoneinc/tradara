import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getAdminChannelAccessData,
  getAdminOverviewData,
  getAdminUsersData
} from "../lib/admin-api";

describe("admin api client", () => {
  beforeEach(() => {
    process.env.ADMIN_WEB_BASE_URL = "http://localhost:3002";
    process.env.BOT_API_BASE_URL = "http://localhost:3001";
    vi.restoreAllMocks();
  });

  it("returns a safe fallback overview snapshot when the admin API responds with 500", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));

    const data = await getAdminOverviewData();

    expect(data.telegramAutomationState).toBe("stubbed");
    expect(data.billingExecutionState).toBe("stubbed");
    expect(data.metrics).toEqual({
      grantedAccess: 0,
      pendingActions: 0,
      atRiskAccounts: 0
    });
  });

  it("returns a safe fallback channel-access snapshot when fetch throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const data = await getAdminChannelAccessData();

    expect(data.telegramAutomationState).toBe("stubbed");
    expect(data.rows).toEqual([]);
  });

  it("keeps strict failure behavior for endpoints without fallback", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("{}", { status: 500 })));

    await expect(getAdminUsersData()).rejects.toThrow(
      "Failed to load admin data from /v1/admin/users: 500"
    );
  });
});
