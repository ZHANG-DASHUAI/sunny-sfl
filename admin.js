const STATS_WORKER_URL = "";
const PASSWORD_STORAGE_KEY = "musicBoxAdminPassword";

const $ = (selector) => document.querySelector(selector);

const loginCard = $("#loginCard");
const dashboard = $("#dashboard");
const passwordInput = $("#passwordInput");
const loginButton = $("#loginButton");
const logoutButton = $("#logoutButton");
const refreshButton = $("#refreshButton");
const loginStatus = $("#loginStatus");
const lastAccessText = $("#lastAccessText");
const rankingBody = $("#rankingBody");
const sessionsBody = $("#sessionsBody");
const playsBody = $("#playsBody");
const eventsBody = $("#eventsBody");
const switchBody = $("#switchBody");

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
    play: "播放",
    pause: "暂停",
    song_change: "切歌",
    lyric_open: "进入歌词页",
    mood_click: "心情点击"
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
  const firstPlayed = Array.isArray(item.playedSongs) ? item.playedSongs[0] : null;
  return firstPlayed?.title || firstPlayed?.songId || "--";
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
    <tr>
      <td>${formatDate(item.lastSeenAt || item.time)}</td>
      <td><span class="tag ${statusClass(item.humanStatus)}">${escapeHtml(item.humanStatus || "观察中")}</span></td>
      <td>${escapeHtml(locationText(item))}<br><span class="muted-small">${escapeHtml(showUnknown(item.timezone))}</span></td>
      <td>${escapeHtml(showUnknown(item.ip))}</td>
      <td>${escapeHtml(showUnknown(item.device))}<br><span class="muted-small">${escapeHtml(showUnknown(item.browser))}${item.isWeChat ? " / 微信" : ""}</span></td>
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
      <td>${escapeHtml(showUnknown(item.device))}</td>
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

  renderRows(eventsBody, data.recentEvents || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td><span class="tag">${escapeHtml(eventLabel(item.type))}</span></td>
      <td>${escapeHtml(item.title || item.toTitle || item.mood || "--")}</td>
      <td>${escapeHtml(showUnknown(item.mode || item.reason))}</td>
      <td>${escapeHtml(showUnknown(item.device))}</td>
      <td>${escapeHtml(locationText(item))}</td>
      <td>${escapeHtml(showUnknown(item.page))}</td>
    </tr>
  `, 7);
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
