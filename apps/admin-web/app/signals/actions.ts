"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { loadAdminWebEnv } from "@tradara/shared-config";

import {
  ADMIN_AUTH_COOKIE_NAME,
  verifySignedAdminSession
} from "../../lib/admin-auth";

async function getAdminActorId(): Promise<string> {
  const env = loadAdminWebEnv(process.env);

  if (env.ADMIN_TELEGRAM_AUTH_ENABLED !== "true" || !env.ADMIN_SESSION_SECRET) {
    return "admin-console";
  }

  const token = (await cookies()).get(ADMIN_AUTH_COOKIE_NAME)?.value;
  if (!token) {
    return "admin-console";
  }

  const result = verifySignedAdminSession(token, env.ADMIN_SESSION_SECRET);
  return result.valid && result.userId ? result.userId : "admin-console";
}

async function postToBotApi(path: string, body: Record<string, unknown>): Promise<void> {
  const env = loadAdminWebEnv(process.env);
  const response = await fetch(new URL(path, env.BOT_API_BASE_URL), {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: JSON.stringify(body),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Bot API request failed for ${path}: ${response.status}`);
  }
}

export async function submitSignalReviewAction(formData: FormData): Promise<void> {
  const signalId = String(formData.get("signalId") ?? "");
  const action = String(formData.get("reviewAction") ?? "");
  const notes = String(formData.get("notes") ?? "").trim();
  const editedTelegramDraft = String(formData.get("editedTelegramDraft") ?? "").trim();

  await postToBotApi(`/v1/signals/${signalId}/reviews`, {
    reviewerId: await getAdminActorId(),
    action,
    ...(notes ? { notes } : {}),
    ...(editedTelegramDraft ? { editedTelegramDraft } : {})
  });

  revalidatePath("/signals/review-queue");
  revalidatePath("/signals/approved");
  revalidatePath("/signals/rejected");
  revalidatePath("/signals/watchlist");
}

export async function publishApprovedSignalAction(formData: FormData): Promise<void> {
  const signalId = String(formData.get("signalId") ?? "");

  await postToBotApi(`/v1/signals/${signalId}/publish`, {
    publisherId: await getAdminActorId()
  });

  revalidatePath("/signals/approved");
  revalidatePath("/signals/published");
}
