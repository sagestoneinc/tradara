import { Client } from "node-appwrite";

export default async ({ req, res, log, error }: any) => {
  const botApiBaseUrl = process.env.BOT_API_BASE_URL;
  const adminApiSecret = process.env.ADMIN_API_SECRET;

  if (!botApiBaseUrl) {
    return res.json({ error: "BOT_API_BASE_URL not configured" }, 500);
  }

  const response = await fetch(`${botApiBaseUrl}/v1/admin/reconcile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-admin-secret": adminApiSecret ?? ""
    }
  });

  const data = await response.json();
  log("Reconciliation triggered:", JSON.stringify(data));
  return res.json({ ok: true, result: data });
};
