const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("idealhub_token");
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || `Request failed (${response.status})`);
  return data;
}

export const api = {
  health: () => request("/health"),
  getCourses: () => request("/courses"),
  submitEnquiry: (payload) => request("/enquiries", { method: "POST", body: JSON.stringify(payload) }),
  login: (email, password) => request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  getDashboard: () => request("/student/dashboard"),
};

export function saveSession(data) {
  localStorage.setItem("idealhub_token", data.token);
  localStorage.setItem("idealhub_user", JSON.stringify(data.user));
}

export function getSessionUser() {
  try { return JSON.parse(localStorage.getItem("idealhub_user") || "null"); }
  catch { return null; }
}

export function clearSession() {
  localStorage.removeItem("idealhub_token");
  localStorage.removeItem("idealhub_user");
}

export { API_BASE };
