import {
  accountAccessSnapshotSchema,
  accountProfileSchema,
  type AccountAccessSnapshot,
  type AccountProfile
} from "@tradara/shared-types";
import { loadMarketingSiteEnv } from "@tradara/shared-config";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

function getEnv() {
  return loadMarketingSiteEnv(process.env);
}

async function getSessionToken(): Promise<string | null> {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  const session = await auth();
  if (!session.userId) {
    return null;
  }

  return session.getToken();
}

async function fetchAccountData<T>(
  path: string,
  parse: (input: unknown) => T
): Promise<T> {
  const env = getEnv();
  const token = await getSessionToken();

  if (!token) {
    redirect("/sign-in");
  }

  const response = await fetch(new URL(path, env.BOT_API_BASE_URL), {
    cache: "no-store",
    headers: {
      authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to load account data from ${path}: ${response.status}`);
  }

  const payload = (await response.json()) as { success?: boolean; data?: unknown };
  if (!payload.success) {
    throw new Error(`Account API returned a non-success envelope for ${path}`);
  }

  return parse(payload.data);
}

export async function getAccountProfile(): Promise<AccountProfile> {
  return fetchAccountData("/v1/account/me", (input) => accountProfileSchema.parse(input));
}

export async function getAccountAccess(): Promise<AccountAccessSnapshot> {
  return fetchAccountData("/v1/account/access", (input) =>
    accountAccessSnapshotSchema.parse(input)
  );
}
