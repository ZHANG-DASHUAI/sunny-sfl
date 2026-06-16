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
const playsBody = $("#playsBody");
const visitsBody = $("#visitsBody");
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

function renderRows(tbody, rows, template) {
  tbody.innerHTML = rows.length
    ? rows.map(template).join("")
    : `<tr><td colspan="8">暂时还没有记录。</td></tr>`;
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
  lastAccessText.textContent = `最后在线时间：${formatDate(data.lastAccess?.time)}`;

  renderRows(rankingBody, data.ranking || [], (item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(item.title || item.songId)}</td>
      <td>${escapeHtml(item.songId)}</td>
      <td><span class="tag">${Number(item.count || 0)}</span></td>
      <td>${formatDate(item.lastPlayedAt)}</td>
    </tr>
  `);

  renderRows(playsBody, data.recentPlays || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td>${escapeHtml(item.title)}</td>
      <td>${escapeHtml(item.songId)}</td>
      <td><span class="tag">${escapeHtml(item.mode)}</span></td>
      <td>${escapeHtml(item.device)}</td>
      <td>${escapeHtml(item.page)}</td>
    </tr>
  `);

  renderRows(visitsBody, data.recentVisits || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td>${escapeHtml(showUnknown(item.country))}</td>
      <td>${escapeHtml(showUnknown(item.city || item.region))}</td>
      <td>${escapeHtml(showUnknown(item.timezone))}</td>
      <td>${escapeHtml(showUnknown(item.ip))}</td>
      <td>${escapeHtml(showUnknown(item.device))}</td>
      <td>${escapeHtml(item.page)}</td>
      <td>${escapeHtml(item.userAgent)}</td>
    </tr>
  `);

  renderRows(switchBody, data.recentSwitches || [], (item) => `
    <tr>
      <td>${formatDate(item.time)}</td>
      <td>${escapeHtml(item.reason)}</td>
      <td>${escapeHtml(item.fromTitle || item.fromSongId)}</td>
      <td>${escapeHtml(item.toTitle || item.toSongId)}</td>
      <td><span class="tag">${escapeHtml(item.mode)}</span></td>
    </tr>
  `);
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
