const LOG_LIMIT = 160;
const LOG_TTL_SECONDS = 60 * 60 * 24 * 90;
const LIST_LIMIT = 1000;

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
  return typeof value === "string" ? value.slice(0, 1000) : fallback;
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
  return {
    country: normalizeText(cf.country),
    city: normalizeText(cf.city),
    region: normalizeText(cf.region),
    timezone: normalizeText(cf.timezone),
    colo: normalizeText(cf.colo),
    ip: maskIp(getClientIp(request))
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

function normalizeEventType(type) {
  const raw = normalizeText(type);
  if (raw === "visit") return "page_view";
  if (raw === "switch") return "song_change";
  return raw;
}

function isInteractionType(type) {
  return [
    "mood_click",
    "song_open",
    "play",
    "pause",
    "ended",
    "seek",
    "next_song",
    "prev_song",
    "mode_change",
    "lyric_open",
    "lyric_scroll",
    "note_open",
    "note_submit",
    "geo_permission"
  ].includes(type);
}

function isBotUserAgent(userAgent) {
  return /Headless|bot|crawler|spider|preview|X11; Linux|Linux x86_64|Ubuntu|Debian/i.test(userAgent || "");
}

function getHumanStatus(session) {
  if (session.isWechat && Number(session.playCount || 0) > 0) return "高度疑似真人";
  if (session.isLikelyBot) return "疑似机器人";
  if (
    Number(session.playCount || 0) > 0 ||
    Number(session.clickCount || 0) > 0 ||
    Number(session.lyricScrollCount || 0) > 0 ||
    Number(session.durationSeconds || 0) >= 10
  ) {
    return "疑似真人";
  }
  if (
    Number(session.durationSeconds || 0) < 3 &&
    Number(session.clickCount || 0) === 0 &&
    Number(session.playCount || 0) === 0
  ) {
    return "疑似机器人/预加载";
  }
  return "观察中";
}

function makeVisitorId(payload) {
  return normalizeText(payload.visitorId) ||
    normalizeText(payload.clientId) ||
    `visitor_${Date.now()}_${crypto.randomUUID()}`;
}

function makeSessionId(payload) {
  return normalizeText(payload.sessionId) ||
    `${makeVisitorId(payload)}_${Date.now()}`;
}

function makeEvent(request, payload, now) {
  const type = normalizeEventType(payload.type);
  const visitorId = makeVisitorId(payload);
  const sessionId = makeSessionId(payload);
  return {
    type,
    visitorId,
    sessionId,
    visitorTag: normalizeText(payload.visitorTag || "unknown") || "unknown",
    createdAt: now,
    time: now,
    clientId: normalizeText(payload.clientId),
    page: normalizeText(payload.page),
    pagePath: normalizeText(payload.pagePath || payload.page),
    referrer: normalizeText(payload.referrer),
    language: normalizeText(payload.language),
    screenWidth: normalizeNumber(payload.screenWidth),
    screenHeight: normalizeNumber(payload.screenHeight),
    userAgent: normalizeText(payload.userAgent),
    browser: normalizeText(payload.browser),
    os: normalizeText(payload.os),
    deviceType: normalizeText(payload.deviceType || payload.device),
    device: normalizeText(payload.deviceType || payload.device),
    isWechat: normalizeBoolean(payload.isWechat || payload.isWeChat),
    isWeChat: normalizeBoolean(payload.isWechat || payload.isWeChat),
    songId: normalizeText(payload.songId),
    songName: normalizeText(payload.songName || payload.title),
    title: normalizeText(payload.title || payload.songName),
    mode: normalizeText(payload.mode),
    playMode: normalizeText(payload.playMode || payload.mode),
    audioField: normalizeText(payload.audioField),
    reason: normalizeText(payload.reason),
    fromSongId: normalizeText(payload.fromSongId),
    fromTitle: normalizeText(payload.fromTitle),
    toSongId: normalizeText(payload.toSongId),
    toTitle: normalizeText(payload.toTitle),
    mood: normalizeText(payload.mood),
    startedAt: normalizeText(payload.startedAt),
    endedAt: normalizeText(payload.endedAt),
    listenedSeconds: normalizeNumber(payload.listenedSeconds),
    songDuration: normalizeNumber(payload.songDuration),
    listenedPercent: normalizeNumber(payload.listenedPercent),
    isFinished: normalizeBoolean(payload.isFinished),
    isInterrupted: normalizeBoolean(payload.isInterrupted),
    currentSecond: normalizeNumber(payload.currentSecond),
    fromSecond: normalizeNumber(payload.fromSecond),
    toSecond: normalizeNumber(payload.toSecond),
    geoAuthorized: payload.geoAuthorized === undefined ? undefined : normalizeBoolean(payload.geoAuthorized),
    latitude: payload.geoAuthorized ? normalizeNumber(payload.latitude) : undefined,
    longitude: payload.geoAuthorized ? normalizeNumber(payload.longitude) : undefined,
    accuracy: payload.geoAuthorized ? normalizeNumber(payload.accuracy) : undefined,
    geoTime: normalizeText(payload.geoTime),
    geoError: normalizeText(payload.geoError),
    ...getLocationInfo(request)
  };
}

async function incrementSongCount(kv, event) {
  const songId = normalizeText(event.songId);
  if (!songId) return;

  const key = `count:${songId}`;
  const current = await kv.get(key, "json");
  await kv.put(key, JSON.stringify({
    songId,
    title: normalizeText(event.songName || event.title),
    count: Number(current?.count || 0) + 1,
    lastPlayedAt: event.createdAt
  }));
}

function uniqueRecent(items, next, keyName, limit = 30) {
  const list = Array.isArray(items) ? items : [];
  const nextKey = next?.[keyName];
  return [next, ...list.filter((item) => item?.[keyName] !== nextKey)].filter(Boolean).slice(0, limit);
}

function updateSessionSongs(session, event) {
  const songId = event.songId || event.toSongId;
  const songName = event.songName || event.title || event.toTitle;
  if (!songId && !songName) return session.songs || [];
  return uniqueRecent(session.songs, {
    songId,
    songName,
    mode: event.mode || event.playMode,
    listenedSeconds: event.listenedSeconds,
    listenedPercent: event.listenedPercent,
    isFinished: event.isFinished,
    time: event.createdAt
  }, "songId", 20);
}

function updatePages(session, event) {
  if (!event.pagePath) return session.pages || [];
  return uniqueRecent(session.pages, {
    pagePath: event.pagePath,
    time: event.createdAt
  }, "pagePath", 20);
}

function updateMoods(session, event) {
  if (!event.mood) return session.moods || [];
  return uniqueRecent(session.moods, {
    mood: event.mood,
    time: event.createdAt
  }, "mood", 20);
}

function buildPreciseGeo(current, event) {
  if (event.geoAuthorized === true) {
    return {
      geoAuthorized: true,
      latitude: event.latitude,
      longitude: event.longitude,
      accuracy: event.accuracy,
      geoTime: event.geoTime || event.createdAt
    };
  }
  if (event.geoAuthorized === false) {
    return {
      ...(current || {}),
      geoAuthorized: false,
      geoError: event.geoError || "denied"
    };
  }
  return current || {};
}

async function updateSession(kv, event) {
  const key = `session:${event.sessionId}`;
  const current = await kv.get(key, "json");
  const createdAt = current?.createdAt || current?.firstSeenAt || event.createdAt;
  const firstTime = new Date(createdAt).getTime();
  const lastTime = new Date(event.createdAt).getTime();
  const durationSeconds = Number.isFinite(firstTime) && Number.isFinite(lastTime)
    ? Math.max(0, Math.round((lastTime - firstTime) / 1000))
    : 0;

  const clickIncrement = isInteractionType(event.type) ? 1 : 0;
  const session = {
    ...(current || {}),
    visitorId: event.visitorId,
    sessionId: event.sessionId,
    visitorTag: event.visitorTag || current?.visitorTag || "unknown",
    createdAt,
    firstSeenAt: createdAt,
    lastActiveAt: event.createdAt,
    lastSeenAt: event.createdAt,
    durationSeconds,
    ip: event.ip || current?.ip || "",
    country: event.country || current?.country || "",
    city: event.city || current?.city || "",
    region: event.region || current?.region || "",
    timezone: event.timezone || current?.timezone || "",
    userAgent: event.userAgent || current?.userAgent || "",
    deviceType: event.deviceType || current?.deviceType || "",
    device: event.deviceType || current?.device || "",
    browser: event.browser || current?.browser || "",
    os: event.os || current?.os || "",
    language: event.language || current?.language || "",
    screenWidth: event.screenWidth || current?.screenWidth || 0,
    screenHeight: event.screenHeight || current?.screenHeight || 0,
    referrer: event.referrer || current?.referrer || "",
    pagePath: event.pagePath || current?.pagePath || "",
    page: event.page || current?.page || "",
    isWechat: event.isWechat || Boolean(current?.isWechat),
    isWeChat: event.isWechat || Boolean(current?.isWeChat),
    isLikelyBot: Boolean(current?.isLikelyBot) || isBotUserAgent(event.userAgent),
    eventCount: Number(current?.eventCount || 0) + 1,
    behaviorCount: Number(current?.behaviorCount || 0) + clickIncrement,
    clickCount: Number(current?.clickCount || 0) + clickIncrement,
    pageViews: Number(current?.pageViews || 0) + (event.type === "page_view" ? 1 : 0),
    activePingCount: Number(current?.activePingCount || 0) + (event.type === "active_ping" ? 1 : 0),
    playCount: Number(current?.playCount || 0) + (event.type === "play" ? 1 : 0),
    pauseCount: Number(current?.pauseCount || 0) + (event.type === "pause" ? 1 : 0),
    endedCount: Number(current?.endedCount || 0) + (event.type === "ended" ? 1 : 0),
    seekCount: Number(current?.seekCount || 0) + (event.type === "seek" ? 1 : 0),
    lyricOpenCount: Number(current?.lyricOpenCount || 0) + (event.type === "lyric_open" ? 1 : 0),
    lyricScrollCount: Number(current?.lyricScrollCount || 0) + (event.type === "lyric_scroll" ? 1 : 0),
    moodClickCount: Number(current?.moodClickCount || 0) + (event.type === "mood_click" ? 1 : 0),
    noteSubmitCount: Number(current?.noteSubmitCount || 0) + (event.type === "note_submit" ? 1 : 0),
    lastEventType: event.type,
    lastSongId: event.songId || event.toSongId || current?.lastSongId || "",
    lastSongTitle: event.songName || event.title || event.toTitle || current?.lastSongTitle || "",
    lastPlayMode: event.playMode || event.mode || current?.lastPlayMode || "",
    pages: updatePages(current || {}, event),
    moods: updateMoods(current || {}, event),
    songs: ["song_open", "play", "pause", "ended", "song_change", "seek"].includes(event.type)
      ? updateSessionSongs(current || {}, event)
      : (current?.songs || []),
    preciseGeo: buildPreciseGeo(current?.preciseGeo, event)
  };

  session.humanStatus = getHumanStatus(session);
  await kv.put(key, JSON.stringify(session), { expirationTtl: LOG_TTL_SECONDS });
  return session;
}

async function updateVisitor(kv, session) {
  const key = `visitor:${session.visitorId}`;
  const current = await kv.get(key, "json");
  const visitor = {
    ...(current || {}),
    visitorId: session.visitorId,
    visitorTag: session.visitorTag || current?.visitorTag || "unknown",
    createdAt: current?.createdAt || session.createdAt,
    lastActiveAt: session.lastActiveAt,
    sessionCount: Math.max(Number(current?.sessionCount || 0), 0),
    ip: session.ip,
    country: session.country,
    city: session.city,
    timezone: session.timezone,
    userAgent: session.userAgent,
    deviceType: session.deviceType,
    browser: session.browser,
    os: session.os,
    language: session.language,
    isWechat: session.isWechat,
    isLikelyBot: session.isLikelyBot,
    humanStatus: session.humanStatus,
    totalPlayCount: Number(current?.totalPlayCount || 0) + (session.lastEventType === "play" ? 1 : 0),
    totalBehaviorCount: Number(current?.totalBehaviorCount || 0) + (isInteractionType(session.lastEventType) ? 1 : 0),
    lastSongTitle: session.lastSongTitle,
    lastSongId: session.lastSongId,
    sessions: uniqueRecent(current?.sessions || [], {
      sessionId: session.sessionId,
      visitorTag: session.visitorTag || "unknown",
      createdAt: session.createdAt,
      lastActiveAt: session.lastActiveAt,
      durationSeconds: session.durationSeconds,
      city: session.city,
      country: session.country,
      deviceType: session.deviceType
    }, "sessionId", 20),
    preciseGeo: session.preciseGeo || current?.preciseGeo || {}
  };
  visitor.sessionCount = visitor.sessions.length;
  await kv.put(key, JSON.stringify(visitor), { expirationTtl: LOG_TTL_SECONDS });
}

export async function recordStats(request, kv) {
  let payload = {};
  try {
    payload = await request.json();
  } catch (error) {
    return json({ ok: false, error: "Invalid JSON" }, 400);
  }

  const now = new Date().toISOString();
  const event = makeEvent(request, payload, now);
  if (!event.type) return json({ ok: true, ignored: true });
  if (event.pagePath.startsWith("/admin") || event.page.startsWith("/admin")) {
    return json({ ok: true, ignored: "admin" });
  }

  await kv.put("lastAccess", JSON.stringify(event));
  await putLog(kv, "event", event);

  if (event.type === "page_view") await putLog(kv, "visit", event);
  if (event.type === "play") {
    await putLog(kv, "play", event);
    await incrementSongCount(kv, event);
  }
  if (event.type === "song_change" || event.type === "next_song" || event.type === "prev_song") {
    await putLog(kv, "switch", event);
  }

  const session = await updateSession(kv, event);
  await updateVisitor(kv, session);
  return json({ ok: true, sessionStatus: session.humanStatus });
}

async function listByPrefix(kv, prefix, limit = LIST_LIMIT) {
  const listed = await kv.list({ prefix, limit });
  const rows = await Promise.all(listed.keys.map((item) => kv.get(item.name, "json")));
  return rows.filter(Boolean);
}

async function listLogs(kv, prefix, limit = LOG_LIMIT) {
  return (await listByPrefix(kv, `${prefix}:`, limit))
    .sort((a, b) => String(b.time || b.createdAt).localeCompare(String(a.time || a.createdAt)));
}

async function listSessions(kv) {
  return (await listByPrefix(kv, "session:", LIST_LIMIT))
    .sort((a, b) => String(b.lastActiveAt || b.lastSeenAt).localeCompare(String(a.lastActiveAt || a.lastSeenAt)))
    .slice(0, 120);
}

async function listVisitors(kv) {
  return (await listByPrefix(kv, "visitor:", LIST_LIMIT))
    .sort((a, b) => String(b.lastActiveAt).localeCompare(String(a.lastActiveAt)))
    .slice(0, 120);
}

async function listRanking(kv) {
  return (await listByPrefix(kv, "count:", LIST_LIMIT))
    .sort((a, b) => Number(b.count || 0) - Number(a.count || 0))
    .slice(0, 50);
}

export async function getAdminSummary(kv) {
  const [recentSessions, recentVisitors, recentEvents, recentPlays, recentSwitches, ranking, lastAccess] = await Promise.all([
    listSessions(kv),
    listVisitors(kv),
    listLogs(kv, "event", 260),
    listLogs(kv, "play", 160),
    listLogs(kv, "switch", 160),
    listRanking(kv),
    kv.get("lastAccess", "json")
  ]);

  return {
    ok: true,
    lastAccess,
    recentVisitors: recentVisitors.slice(0, 80),
    recentSessions: recentSessions.slice(0, 80),
    recentVisits: recentSessions.slice(0, 80),
    recentEvents: recentEvents.slice(0, 160),
    recentPlays: recentPlays.slice(0, 80),
    recentSwitches: recentSwitches.slice(0, 80),
    ranking
  };
}

export async function clearStats(kv) {
  const prefixes = ["event:", "visit:", "play:", "switch:", "session:", "visitor:", "count:"];
  let deleted = 0;
  for (const prefix of prefixes) {
    let cursor;
    do {
      const listed = await kv.list({ prefix, limit: 1000, cursor });
      await Promise.all(listed.keys.map((item) => kv.delete(item.name)));
      deleted += listed.keys.length;
      cursor = listed.list_complete ? undefined : listed.cursor;
    } while (cursor);
  }
  await kv.delete("lastAccess");
  return { ok: true, deleted };
}
