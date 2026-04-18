import type {
  ChannelAccessStatus,
  EntitlementStatus,
  SubscriptionStatus
} from "@tradara/shared-types";

export type TelegramConnectionStatus = "connected" | "invited" | "missing";

export function lifecycleBadgeVariant(
  status: SubscriptionStatus | EntitlementStatus | ChannelAccessStatus
): "active" | "grace" | "inactive" | "outline" {
  if (status === "active" || status === "trialing" || status === "granted") {
    return "active";
  }

  if (
    status === "grace_period" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "pending_grant" ||
    status === "pending_revoke"
  ) {
    return "grace";
  }

  if (status === "inactive" || status === "expired" || status === "revoked" || status === "error") {
    return "inactive";
  }

  return "outline";
}

export function telegramBadgeVariant(
  status: TelegramConnectionStatus
): "active" | "grace" | "inactive" {
  if (status === "connected") {
    return "active";
  }

  if (status === "invited") {
    return "grace";
  }

  return "inactive";
}

export function formatAdminDate(iso: string | null): string {
  if (!iso) {
    return "None";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(new Date(iso));
}
