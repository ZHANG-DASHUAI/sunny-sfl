import { json, recordStats } from "../_shared/stats.js";

export async function onRequestPost(context) {
  if (!context.env.STATS_KV) {
    return json({ ok: false, error: "KV binding STATS_KV is missing" }, 500);
  }

  try {
    return await recordStats(context.request, context.env.STATS_KV);
  } catch (error) {
    console.error("Stats write failed:", error);
    return json({ ok: false, error: "Stats write failed" }, 500);
  }
}

export function onRequest() {
  return json({ ok: false, error: "Method not allowed" }, 405);
}
