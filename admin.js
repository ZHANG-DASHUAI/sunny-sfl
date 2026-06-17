const STATS_WORKER_URL = "";
const PASSWORD_STORAGE_KEY = "musicBoxAdminPassword";

const $ = (selector) => document.querySelector(selector);

const loginCard = $("#loginCard");
const dashboard = $("#dashboard");
const passwordInput = $("#passwordInput");
const loginButton = $("#loginButton");
const logoutButton = $("#logoutButton");
const refreshButton = $("#refreshButton");
const clearStatsButton = $("#clearStatsButton");
const showRecentButton = $("#showRecentButton");
const showTimelineButton = $("#showTimelineButton");
const loginStatus = $("#loginStatus");
const lastAccessText = $("#lastAccessText");
const rankingBody = $("#rankingBody");
const sessionsBody = $("#sessionsBody");
const visitorSessionsBody = $("#visitorSessionsBody");
const visitorDetailPanel = $("#visitorDetailPanel");
const visitorDetailHint = $("#visitorDetailHint");
const timelinePanel = $("#timelinePanel");
const timelineHint = $("#timelineHint");
const playsBody = $("#playsBody");
const eventsBody = $("#eventsBody");
const switchBody = $("#switchBody");

let latestSummary = null;
let selectedVisitorId = "";

function getEndpoint(path) {
  if (!STATS_WORKER_URL) return path;
  return new URL(path, STATS_WORKER_URL).href;
}

function formatDate(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("zh-CN", { hour12: false });
}

function formatDuration(seconds) {
  const value = Number(seconds);
  if (!Number.isFinite(value) || value <= 0) return "0秒";
  if (value < 60) return `${Math.round(value)}秒`;
  const minutes = Math.floor(value / 60);
  const rest = Math.round(value % 60);
  return `${minutes}分${String(rest).padStart(2, "0")}秒`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showUnknown(value) {
  const text = String(value ?? "").trim();
  return text || "未知";
}

function renderRows(tbody, rows, template, colspan = 8) {
  tbody.innerHTML = rows.length
    ? rows.map(template).join("")
    : `<tr><td colspan="${colspan}">暂时还没有记录。</td></tr>`;
}

function eventLabel(type) {
  const labels = {
    page_view: "打开页面",
    page_hide: "离开页面",
    active_ping: "仍在停留",
    song_open: "打开歌曲",
    play: "播放",
    pause: "暂停",
    ended: "播放完成",
    seek: "拖动进度",
    next_song: "下一首",
    prev_song: "上一首",
    mode_change: "切换模式",
    song_change: "切歌",
    lyric_open: "进入歌词页",
    lyric_scroll: "浏览歌词",
    mood_click: "心情点击",
    note_open: "打开留言",
    note_submit: "提交留言",
    geo_permission: "定位授权"
  };
  return labels[type] || type || "--";
}

function statusClass(status) {
  if (status === "疑似真人") return "is-human";
  if (String(status).includes("机器人")) return "is-bot";
  return "is-watch";
}

function locationText(item) {
  const parts = [item.country, item.region, item.city].map(showUnknown).filter((value) => value !== "未知");
  return parts.length ? parts.join(" / ") : "未知";
}

function sessionSongText(item) {
  if (item.lastSongTitle) return item.lastSongTitle;
  const firstPlayed = Array.isArray(item.songs) ? item.songs[0] : null;
  return firstPlayed?.songName || firstPlayed?.title || firstPlayed?.songId || "--";
}

function listSummary(items, labelKey, emptyText = "--") {
  if (!Array.isArray(items) || !items.length) return emptyText;
  return items.slice(0, 5).map((item) => escapeHtml(item[labelKey] || item.title || item.songName || item.pagePath || item.mood || "--")).join("<br>");
}

function geoText(item) {
  const geo = item.preciseGeo || {};
  if (geo.geoAuthorized === true) {
    return `用户授权<br><span class="muted-small">${escapeHtml(geo.latitude)}, ${escapeHtml(geo.longitude)} / ±${escapeHtml(geo.accuracy)}m</span>`;
  }
  if (geo.geoAuthorized === false) return `用户拒绝<br><span class="muted-small">${escapeHtml(geo.geoError || "")}</span>`;
  return "未授权，仅 IP 推测";
}

function renderVisitorDetail(visitorId) {
  selectedVisitorId = visitorId;
  const sessions = (latestSummary?.recentSessions || [])
    .filter((item) => item.visitorId === visitorId)
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  const events = (latestSummary?.recentEvents || [])
    .filter((item) => item.visitorId === visitorId);
  const visitor = (latestSummary?.recentVisitors || []).find((item) => item.visitorId === visitorId);

  visitorDetailPanel.hidden = false;
  visitorDetailHint.textContent = `访客：${visitorId}，共 ${sessions.length} 次访问，${events.length} 条行为。`;

  renderRows(visitorSessionsBody, sessions, (item) => `
    <tr>
      <td>${formatDate(item.createdAt)}</td>
      <td>${formatDate(item.lastActiveAt || item.lastSeenAt)}</td>
      <td>${formatDuration(item.durationSeconds)}</td>
      <td>${escapeHtml(locationText(item))}<br><span class="muted-small">${escapeHtml(showUnknown(item.ip))}</span></td>
      <td>${escapeHtml(showUnknown(item.deviceType || item.device))}<br><span class="muted-small">${escapeHtml(showUnknown(item.browser))} / ${escapeHtml(showUnknown(item.os))}</span></td>
      <td>${listSummary(item.pages, "pagePath")}</td>
      <td>${listSummary(item.moods, "mood")}</td>
      <td>${listSummary(item.songs, "songName")}</td>
      <td>${geoText(item.preciseGeo ? item : visitor || {})}</td>
    </tr>
  `, 9);

  renderEvents(events);
  timelineHint.textContent = `当前只显示访客 ${visitorId} 的行为时间线。`;
}

function renderEvents(rows) {
  renderRows(eventsBody, rows || [], (item) => `
    <tr>
      <td>${formatDate(item.time || item.createdAt)}</td>
      <td><span class="tag">${escapeHtml(eventLabel(item.type))}</span></td>
      <td>${escapeHtml(item.title || item.songName || item.toTitle || item.mood || "--")}</td>
      <td>${escapeHtml(showUnknown(item.mode || item.reason || item.playMode))}</td>
      <td>${escapeHtml(showUnknown(item.deviceType || item.device))}</td>
      <td>${escapeHtml(locationText(item))}</td>
      <td>${escapeHtml(showUnknown(item.pagePath || item.page))}</td>
    </tr>
  `, 7);
}

async function fetchSummary(password) {
  const response = await fetch(getEndpoint("/api/admin/summary"), {
    headers: {
      "X-Admin-Password": password
    }
  });

  if (!response.ok) {
    throw new Error(response.status === 401 ? "密码不对，请再试一次。" : "后台数据读取失败。");
  }

  return response.json();
}

function renderSummary(data) {
  latestSummary = data;
  lastAccessText.textContent = `最后访问时间：${formatDate(data.lastAccess?.time)}`;

  renderRows(rankingBody, data.ranking || [], (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(item.title || item.songId)}</td>
      <td>${escapeHtml(item.songId)}</td>
      <td><span class="tag">${Number(item.count || 0)}</span></td>
      <td>${formatDate(item.lastPlayedAt)}</td>
    </tr>
  `, 5);

  renderRows(sessionsBody, data.recentSessions || data.recentVisits || [], (item) => `
    <tr class="session-row" data-visitor-id="${escapeHtml(item.visitorId || "")}">
      <td>${formatDate(item.lastActiveAt || item.lastSeenAt || item.time)}</td>
      <td><span class="tag ${statusClass(item.humanStatus)}">${escapeHtml(item.humanStatus || "观察中")}</span></td>
      <td>${escapeHtml(locationText(item))}<br><span class="muted-small">${escapeHtml(showUnknown(item.timezone))}</span></td>
      <td>${escapeHtml(showUnknown(item.ip))}</td>
      <td>${escapeHtml(showUnknown(item.deviceType || item.device))}<br><span class="muted-small">${escapeHtml(showUnknown(item.browser))} / ${escapeHtml(showUnknown(item.os))}${item.isWechat || item.isWeChat ? " / 微信" : ""}</span></td>
      <td>${formatDuration(item.durationSeconds)}</td>
      <td>${Number(item.playCount || 0)}</td>
      <td>${escapeHtml(sessionSongText(item))}<br><span class="muted-small">${escapeHtml(showUnknown(item.lastPlayMode))}</span></td>
      <td>${escapeHtml(showUnknown(item.referrer))}</td>
    </tr>
  `, 9);

  renderRows(playsBody, data.recentPlays || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(item.songId)}</td>
      <td><span class="tag">${escapeHtml(item.mode)}</span></td>
      <td>${escapeHtml(showUnknown(item.deviceType || item.device))}</td>
      <td>${escapeHtml(locationText(item))}</td>
    </tr>
  `, 6);

  renderRows(switchBody, data.recentSwitches || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td>${escapeHtml(item.reason)}</td>
      <td>${escapeHtml(item.fromTitle || item.fromSongId)}</td>
      <td>${escapeHtml(item.toTitle || item.toSongId)}</td>
      <td><span class="tag">${escapeHtml(item.mode)}</span></td>
    </tr>
  `, 5);

  renderEvents(selectedVisitorId
    ? (data.recentEvents || []).filter((item) => item.visitorId === selectedVisitorId)
    : data.recentEvents || []);
}

async function loadDashboard(password) {
  loginStatus.textContent = "正在读取后台数据……";
  const data = await fetchSummary(password);
  renderSummary(data);
  sessionStorage.setItem(PASSWORD_STORAGE_KEY, password);
  loginCard.hidden = true;
  dashboard.hidden = false;
  loginStatus.textContent = "";
}

loginButton.addEventListener("click", async () => {
  const password = passwordInput.value.trim();
  if (!password) {
    loginStatus.textContent = "先输入后台密码。";
    return;
  }

  try {
    await loadDashboard(password);
  } catch (error) {
    loginStatus.textContent = error.message;
  }
});

passwordInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") loginButton.click();
});

refreshButton.addEventListener("click", async () => {
  const password = sessionStorage.getItem(PASSWORD_STORAGE_KEY) || passwordInput.value.trim();
  try {
    await loadDashboard(password);
  } catch (error) {
    loginStatus.textContent = error.message;
    loginCard.hidden = false;
    dashboard.hidden = true;
  }
});

showRecentButton.addEventListener("click", () => {
  selectedVisitorId = "";
  visitorDetailPanel.hidden = true;
  timelineHint.textContent = "默认显示全部访客的最近行为；点击某个访客后会自动筛选。";
  if (latestSummary) renderEvents(latestSummary.recentEvents || []);
});

showTimelineButton.addEventListener("click", () => {
  timelinePanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

sessionsBody.addEventListener("click", (event) => {
  const row = event.target.closest("[data-visitor-id]");
  if (!row || !row.dataset.visitorId) return;
  renderVisitorDetail(row.dataset.visitorId);
  visitorDetailPanel.scrollIntoView({ behavior: "smooth", block: "start" });
});

clearStatsButton.addEventListener("click", async () => {
  const password = sessionStorage.getItem(PASSWORD_STORAGE_KEY) || passwordInput.value.trim();
  const confirmed = window.confirm("确定要清空所有访问记录吗？这个操作不会影响歌曲和音频。");
  if (!confirmed) return;
  clearStatsButton.disabled = true;
  loginStatus.textContent = "正在清空访问记录……";
  try {
    const response = await fetch(getEndpoint("/api/admin/clear"), {
      method: "POST",
      headers: { "X-Admin-Password": password }
    });
    if (!response.ok) throw new Error("清空失败，请稍后再试。");
    selectedVisitorId = "";
    await loadDashboard(password);
    loginStatus.textContent = "访问记录已清空。";
  } catch (error) {
    loginStatus.textContent = error.message;
  } finally {
    clearStatsButton.disabled = false;
  }
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
  passwordInput.value = "";
  loginCard.hidden = false;
  dashboard.hidden = true;
});

const savedPassword = sessionStorage.getItem(PASSWORD_STORAGE_KEY);
if (savedPassword) {
  loadDashboard(savedPassword).catch(() => {
    sessionStorage.removeItem(PASSWORD_STORAGE_KEY);
    loginCard.hidden = false;
    dashboard.hidden = true;
  });
}
