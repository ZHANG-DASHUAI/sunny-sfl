import { clearStats, json } from "../../_shared/stats.js";

const ADMIN_PASSWORD = "888888";

function getPassword(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return request.headers.get("X-Admin-Password") || "";
}

export async function onRequestPost(context) {
  if (getPassword(context.request) !== ADMIN_PASSWORD) {
    return json({ ok: false, error: "Unauthorized" }, 401);
  }

  if (!context.env.STATS_KV) {
    return json({ ok: false, error: "KV binding STATS_KV is missing" }, 500);
  }

  try {
    return json(await clearStats(context.env.STATS_KV));
  } catch (error) {
    console.error("Clear stats failed:", error);
    return json({ ok: false, error: "Clear stats failed" }, 500);
  }
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
