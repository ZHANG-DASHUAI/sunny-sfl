const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Password"
};

const LOG_LIMIT = 100;
const LOG_TTL_SECONDS = 60 * 60 * 24 * 90;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function normalizeText(value, fallback = "") {
  return typeof value === "string" ? value.slice(0, 600) : fallback;
}

function getClientIp(request) {
  return request.headers.get("CF-Connecting-IP") || "";
}

function maskIp(ip) {
  if (!ip) return "";
  if (ip.includes(".")) {
    const parts = ip.split(".");
    if (parts.length === 4) return `${parts[0]}.${parts[1]}.${parts[2]}.xxx`;
  }
  if (ip.includes(":")) {
    const parts = ip.split(":").filter(Boolean);
    return `${parts.slice(0, 3).join(":")}:xxxx`;
  }
  return "xxx";
}

function getLocationInfo(request) {
  const cf = request.cf || {};
  const ip = getClientIp(request);
  return {
    country: normalizeText(cf.country),
    city: normalizeText(cf.city),
    region: normalizeText(cf.region),
    timezone: normalizeText(cf.timezone),
    colo: normalizeText(cf.colo),
    ip: maskIp(ip)
  };
}

function getAdminPassword(request) {
  const auth = request.headers.get("Authorization") || "";
  if (auth.startsWith("Bearer ")) return auth.slice(7).trim();
  return request.headers.get("X-Admin-Password") || "";
}

function isAdmin(request, env) {
  const configured = "888888";
  return Boolean(configured && getAdminPassword(request) === configured);
}

async function readJson(request) {
  try {
    return await request.json();
  } catch (error) {
    return {};
  }
}

function makeLogKey(prefix) {
  const reverseTime = String(Number.MAX_SAFE_INTEGER - Date.now()).padStart(16, "0");
  return `${prefix}:${reverseTime}:${crypto.randomUUID()}`;
}

async function putLog(env, prefix, data) {
  await env.STATS_KV.put(makeLogKey(prefix), JSON.stringify(data), {
    expirationTtl: LOG_TTL_SECONDS
  });
}

async function incrementSongCount(env, payload, now) {
  const songId = normalizeText(payload.songId);
  if (!songId) return;

  const key = `count:${songId}`;
  const current = await env.STATS_KV.get(key, "json");
  const next = {
    songId,
    title: normalizeText(payload.title),
    count: Number(current?.count || 0) + 1,
    lastPlayedAt: now
  };
  await env.STATS_KV.put(key, JSON.stringify(next));
}

async function handleStats(request, env) {
  if (!env.STATS_KV) return json({ ok: false, error: "KV binding STATS_KV is missing" }, 500);

  const payload = await readJson(request);
  const now = new Date().toISOString();
  const type = normalizeText(payload.type);
  const base = {
    time: now,
    page: normalizeText(payload.page),
    userAgent: normalizeText(payload.userAgent),
    device: normalizeText(payload.device),
    clientId: normalizeText(payload.clientId),
    ...getLocationInfo(request)
  };

  await env.STATS_KV.put("lastAccess", JSON.stringify(base));

  if (type === "visit") {
    await putLog(env, "visit", base);
    return json({ ok: true });
  }

  if (type === "play") {
    const playLog = {
      ...base,
      songId: normalizeText(payload.songId),
      title: normalizeText(payload.title),
      mode: normalizeText(payload.mode),
      audioField: normalizeText(payload.audioField),
      reason: normalizeText(payload.reason)
    };
    await putLog(env, "play", playLog);
    await incrementSongCount(env, payload, now);
    return json({ ok: true });
  }

  if (type === "switch") {
    await putLog(env, "switch", {
      ...base,
      fromSongId: normalizeText(payload.fromSongId),
      fromTitle: normalizeText(payload.fromTitle),
      toSongId: normalizeText(payload.toSongId),
      toTitle: normalizeText(payload.toTitle),
      mode: normalizeText(payload.mode),
      playMode: normalizeText(payload.playMode),
      reason: normalizeText(payload.reason)
    });
    return json({ ok: true });
  }

  return json({ ok: true, ignored: true });
}

async function listLogs(env, prefix, limit = LOG_LIMIT) {
  const listed = await env.STATS_KV.list({ prefix: `${prefix}:`, limit });
  const rows = await Promise.all(
    listed.keys.map((item) => env.STATS_KV.get(item.name, "json"))
  );
  return rows.filter(Boolean).sort((a, b) => String(b.time).localeCompare(String(a.time)));
}

async function listRanking(env) {
  const listed = await env.STATS_KV.list({ prefix: "count:", limit: 1000 });
  const rows = await Promise.all(
    listed.keys.map((item) => env.STATS_KV.get(item.name, "json"))
  );
  return rows
    .filter(Boolean)
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 50);
}

async function handleAdmin(request, env) {
  if (!env.STATS_KV) return json({ ok: false, error: "KV binding STATS_KV is missing" }, 500);
  if (!isAdmin(request, env)) return json({ ok: false, error: "Unauthorized" }, 401);

  const [recentVisits, recentPlays, recentSwitches, ranking, lastAccess] = await Promise.all([
    listLogs(env, "visit", 80),
    listLogs(env, "play", 120),
    listLogs(env, "switch", 120),
    listRanking(env),
    env.STATS_KV.get("lastAccess", "json")
  ]);

  return json({
    ok: true,
    lastAccess,
    recentVisits: recentVisits.slice(0, 30),
    recentPlays: recentPlays.slice(0, 50),
    recentSwitches: recentSwitches.slice(0, 50),
    ranking
  });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: JSON_HEADERS });
    }

    if (url.pathname === "/api/stats" && request.method === "POST") {
      return handleStats(request, env);
    }

    if (url.pathname === "/api/admin/summary" && request.method === "GET") {
      return handleAdmin(request, env);
    }

    return json({ ok: false, error: "Not found" }, 404);
  }
};
