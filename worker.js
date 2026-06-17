import { clearStats, getAdminSummary, json, recordStats } from "./functions/_shared/stats.js";

const JSON_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Password"
};

function withCors(response) {
  const headers = new Headers(response.headers);
  Object.entries(JSON_HEADERS).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function getPassword(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return request.headers.get("X-Admin-Password") || "";
}

function isAdmin(request) {
  return getPassword(request) === "888888";
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: JSON_HEADERS });
    }

    if (!env.STATS_KV) {
      return withCors(json({ ok: false, error: "KV binding STATS_KV is missing" }, 500));
    }

    if (url.pathname === "/api/stats" && request.method === "POST") {
      return withCors(await recordStats(request, env.STATS_KV));
    }

    if (url.pathname === "/api/admin/summary" && request.method === "GET") {
      if (!isAdmin(request)) return withCors(json({ ok: false, error: "Unauthorized" }, 401));
      return withCors(json(await getAdminSummary(env.STATS_KV)));
    }

    if (url.pathname === "/api/admin/clear" && request.method === "POST") {
      if (!isAdmin(request)) return withCors(json({ ok: false, error: "Unauthorized" }, 401));
      return withCors(json(await clearStats(env.STATS_KV)));
    }

    return withCors(json({ ok: false, error: "Not found" }, 404));
  }
};
