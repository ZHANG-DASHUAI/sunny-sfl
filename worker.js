const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Admin-Password"
};

const LOG_LIMIT = 120;
const LOG_TTL_SECONDS = 60 * 60 * 24 * 90;
const SESSION_LIST_LIMIT = 1000;

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: JSON_HEADERS
  });
}

function normalizeText(value, fallback = "") {
  return typeof value === "string" ? value.slice(0, 800) : fallback;
}

function normalizeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeBoolean(value) {
  return value === true || value === "true";
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

function isAdmin(request) {
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

function normalizeEventType(type) {
  const raw = normalizeText(type);
  if (raw === "visit") return "page_view";
  if (raw === "switch") return "song_change";
  return raw;
}

function isInteractionType(type) {
  return ["play", "pause", "song_change", "lyric_open", "mood_click"].includes(type);
}

function getHumanStatus(session) {
  const duration = normalizeNumber(session.durationSeconds);
  const playCount = normalizeNumber(session.playCount);
  const songChangeCount = normalizeNumber(session.songChangeCount);
  const interactionCount = normalizeNumber(session.interactionCount);
  const pageViews = normalizeNumber(session.pageViews);
  const eventCount = normalizeNumber(session.eventCount);

  if (playCount > 0 || songChangeCount > 0 || duration >= 10 || interactionCount > 0) {
    return "疑似真人";
  }

  if (pageViews > 0 && eventCount <= pageViews && duration < 3 && interactionCount === 0) {
    return "疑似机器人/预加载";
  }

  return "观察中";
}

function makeSessionId(payload) {
  return normalizeText(payload.sessionId) ||
    normalizeText(payload.clientId) ||
    `anonymous_${Date.now()}_${crypto.randomUUID()}`;
}

function makeBaseEvent(request, payload, now) {
  const type = normalizeEventType(payload.type);
  return {
    type,
    time: now,
    sessionId: makeSessionId(payload),
    clientId: normalizeText(payload.clientId),
    page: normalizeText(payload.page),
    referrer: normalizeText(payload.referrer),
    language: normalizeText(payload.language),
    screenWidth: normalizeNumber(payload.screenWidth),
    screenHeight: normalizeNumber(payload.screenHeight),
    userAgent: normalizeText(payload.userAgent),
    browser: normalizeText(payload.browser),
    device: normalizeText(payload.device),
    isWeChat: normalizeBoolean(payload.isWeChat),
    ...getLocationInfo(request)
  };
}

function withSongFields(event, payload) {
  return {
    ...event,
    songId: normalizeText(payload.songId),
    title: normalizeText(payload.title),
    mode: normalizeText(payload.mode),
    audioField: normalizeText(payload.audioField),
    reason: normalizeText(payload.reason),
    playMode: normalizeText(payload.playMode),
    fromSongId: normalizeText(payload.fromSongId),
    fromTitle: normalizeText(payload.fromTitle),
    toSongId: normalizeText(payload.toSongId),
    toTitle: normalizeText(payload.toTitle),
    mood: normalizeText(payload.mood)
  };
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

function updatePlayedSongs(session, event) {
  const title = event.title || event.toTitle;
  const songId = event.songId || event.toSongId;
  if (!songId && !title) return session.playedSongs || [];

  const nextItem = {
    songId,
    title,
    mode: event.mode,
    time: event.time
  };
  const previous = Array.isArray(session.playedSongs) ? session.playedSongs : [];
  return [nextItem, ...previous].slice(0, 12);
}

async function updateSession(env, event) {
  const key = `session:${event.sessionId}`;
  const current = await env.STATS_KV.get(key, "json");
  const firstSeenAt = current?.firstSeenAt || event.time;
  const first = new Date(firstSeenAt).getTime();
  const last = new Date(event.time).getTime();
  const durationSeconds = Number.isFinite(first) && Number.isFinite(last)
    ? Math.max(0, Math.round((last - first) / 1000))
    : 0;

  const session = {
    ...(current || {}),
    sessionId: event.sessionId,
    clientId: event.clientId || current?.clientId || "",
    firstSeenAt,
    lastSeenAt: event.time,
    durationSeconds,
    page: event.page || current?.page || "",
    lastPage: event.page || current?.lastPage || "",
    referrer: event.referrer || current?.referrer || "",
    language: event.language || current?.language || "",
    screenWidth: event.screenWidth || current?.screenWidth || 0,
    screenHeight: event.screenHeight || current?.screenHeight || 0,
    userAgent: event.userAgent || current?.userAgent || "",
    browser: event.browser || current?.browser || "",
    device: event.device || current?.device || "",
    isWeChat: event.isWeChat || Boolean(current?.isWeChat),
    country: event.country || current?.country || "",
    city: event.city || current?.city || "",
    region: event.region || current?.region || "",
    timezone: event.timezone || current?.timezone || "",
    colo: event.colo || current?.colo || "",
    ip: event.ip || current?.ip || "",
    eventCount: Number(current?.eventCount || 0) + 1,
    interactionCount: Number(current?.interactionCount || 0) + (isInteractionType(event.type) ? 1 : 0),
    pageViews: Number(current?.pageViews || 0) + (event.type === "page_view" ? 1 : 0),
    playCount: Number(current?.playCount || 0) + (event.type === "play" ? 1 : 0),
    pauseCount: Number(current?.pauseCount || 0) + (event.type === "pause" ? 1 : 0),
    songChangeCount: Number(current?.songChangeCount || 0) + (event.type === "song_change" ? 1 : 0),
    lyricOpenCount: Number(current?.lyricOpenCount || 0) + (event.type === "lyric_open" ? 1 : 0),
    moodClickCount: Number(current?.moodClickCount || 0) + (event.type === "mood_click" ? 1 : 0),
    lastEventType: event.type,
    lastSongId: event.songId || event.toSongId || current?.lastSongId || "",
    lastSongTitle: event.title || event.toTitle || current?.lastSongTitle || "",
    lastPlayMode: event.mode || current?.lastPlayMode || "",
    playedSongs: ["play", "song_change"].includes(event.type)
      ? updatePlayedSongs(current || {}, event)
      : (current?.playedSongs || [])
  };

  session.humanStatus = getHumanStatus(session);

  await env.STATS_KV.put(key, JSON.stringify(session), {
    expirationTtl: LOG_TTL_SECONDS
  });
  return session;
}

async function handleStats(request, env) {
  if (!env.STATS_KV) return json({ ok: false, error: "KV binding STATS_KV is missing" }, 500);

  const payload = await readJson(request);
  const now = new Date().toISOString();
  const event = withSongFields(makeBaseEvent(request, payload, now), payload);

  if (!event.type) return json({ ok: true, ignored: true });
  if (event.page.startsWith("/admin")) return json({ ok: true, ignored: "admin" });

  await env.STATS_KV.put("lastAccess", JSON.stringify(event));
  await putLog(env, "event", event);

  if (event.type === "page_view") {
    await putLog(env, "visit", event);
  } else if (event.type === "play") {
    await putLog(env, "play", event);
    await incrementSongCount(env, payload, now);
  } else if (event.type === "song_change") {
    await putLog(env, "switch", event);
  }

  const session = await updateSession(env, event);
  return json({ ok: true, sessionStatus: session.humanStatus });
}

async function listLogs(env, prefix, limit = LOG_LIMIT) {
  const listed = await env.STATS_KV.list({ prefix: `${prefix}:`, limit });
  const rows = await Promise.all(
    listed.keys.map((item) => env.STATS_KV.get(item.name, "json"))
  );
  return rows.filter(Boolean).sort((a, b) => String(b.time).localeCompare(String(a.time)));
}

async function listSessions(env) {
  const listed = await env.STATS_KV.list({ prefix: "session:", limit: SESSION_LIST_LIMIT });
  const rows = await Promise.all(
    listed.keys.map((item) => env.STATS_KV.get(item.name, "json"))
  );
  return rows
    .filter(Boolean)
    .sort((a, b) => String(b.lastSeenAt).localeCompare(String(a.lastSeenAt)))
    .slice(0, 80);
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
  if (!isAdmin(request)) return json({ ok: false, error: "Unauthorized" }, 401);

  const [recentSessions, recentEvents, recentPlays, recentSwitches, ranking, lastAccess] = await Promise.all([
    listSessions(env),
    listLogs(env, "event", 160),
    listLogs(env, "play", 120),
    listLogs(env, "switch", 120),
    listRanking(env),
    env.STATS_KV.get("lastAccess", "json")
  ]);

  return json({
    ok: true,
    lastAccess,
    recentSessions: recentSessions.slice(0, 40),
    recentEvents: recentEvents.slice(0, 80),
    recentVisits: recentSessions.slice(0, 40),
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
