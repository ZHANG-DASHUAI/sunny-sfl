const LOG_LIMIT = 100;
const LOG_TTL_SECONDS = 60 * 60 * 24 * 90;

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store"
    }
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

function makeLogKey(prefix) {
  const reverseTime = String(Number.MAX_SAFE_INTEGER - Date.now()).padStart(16, "0");
  return `${prefix}:${reverseTime}:${crypto.randomUUID()}`;
}

async function putLog(kv, prefix, data) {
  await kv.put(makeLogKey(prefix), JSON.stringify(data), {
    expirationTtl: LOG_TTL_SECONDS
  });
}

async function incrementSongCount(kv, payload, now) {
  const songId = normalizeText(payload.songId);
  if (!songId) return;

  const key = `count:${songId}`;
  const current = await kv.get(key, "json");
  await kv.put(key, JSON.stringify({
    songId,
    title: normalizeText(payload.title),
    count: Number(current?.count || 0) + 1,
    lastPlayedAt: now
  }));
}

export async function recordStats(request, kv) {
  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

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

  await kv.put("lastAccess", JSON.stringify(base));

  if (type === "visit") {
    await putLog(kv, "visit", base);
  } else if (type === "play") {
    await putLog(kv, "play", {
      ...base,
      songId: normalizeText(payload.songId),
      title: normalizeText(payload.title),
      mode: normalizeText(payload.mode),
      audioField: normalizeText(payload.audioField),
      reason: normalizeText(payload.reason)
    });
    await incrementSongCount(kv, payload, now);
  } else if (type === "switch") {
    await putLog(kv, "switch", {
      ...base,
      fromSongId: normalizeText(payload.fromSongId),
      fromTitle: normalizeText(payload.fromTitle),
      toSongId: normalizeText(payload.toSongId),
      toTitle: normalizeText(payload.toTitle),
      mode: normalizeText(payload.mode),
      playMode: normalizeText(payload.playMode),
      reason: normalizeText(payload.reason)
    });
  }

  return json({ ok: true });
}

async function listLogs(kv, prefix, limit = LOG_LIMIT) {
  const listed = await kv.list({ prefix: `${prefix}:`, limit });
  const rows = await Promise.all(listed.keys.map((item) => kv.get(item.name, "json")));
  return rows.filter(Boolean).sort((a, b) => String(b.time).localeCompare(String(a.time)));
}

async function listRanking(kv) {
  const listed = await kv.list({ prefix: "count:", limit: 1000 });
  const rows = await Promise.all(listed.keys.map((item) => kv.get(item.name, "json")));
  return rows
    .filter(Boolean)
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 50);
}

export async function getAdminSummary(kv) {
  const [recentVisits, recentPlays, recentSwitches, ranking, lastAccess] = await Promise.all([
    listLogs(kv, "visit", 80),
    listLogs(kv, "play", 120),
    listLogs(kv, "switch", 120),
    listRanking(kv),
    kv.get("lastAccess", "json")
  ]);

  return {
    ok: true,
    lastAccess,
    recentVisits: recentVisits.slice(0, 30),
    recentPlays: recentPlays.slice(0, 50),
    recentSwitches: recentSwitches.slice(0, 50),
    ranking
  };
}
