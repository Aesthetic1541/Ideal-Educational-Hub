const API_BASE = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

async function request(path, options = {}) {
  const token = localStorage.getItem("idealhub_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      data.message || `Request failed (${response.status})`
    );
  }

  return data;
}

export const api = {
  // =========================
  // PUBLIC
  // =========================

  health: () => request("/health"),

  getCourses: () => request("/courses"),

  submitEnquiry: (payload) =>
    request("/enquiries", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // =========================
  // AUTH
  // =========================

  login: (email, password) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // =========================
  // STUDENT
  // =========================

  getDashboard: () => request("/student/dashboard"),

  
  // =========================
  // ADMIN
  // =========================

  adminDashboard: () =>
    request("/admin/dashboard"),

  adminStudents: () =>
    request("/admin/students"),

  adminEnquiries: () =>
    request("/admin/enquiries"),

  adminTests: () =>
    request("/admin/tests"),

  adminCourses: () =>
    request("/admin/courses"),

  adminCreateCourse: (payload) =>
    request("/admin/courses", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminUpdateCourse: (id, payload) =>
    request(`/admin/courses/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  adminDeleteCourse: (id) =>
    request(`/admin/courses/${id}`, {
      method: "DELETE",
    }),

  adminCreateTest: (payload) =>
    request("/admin/tests", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminCreateResult: (payload) =>
    request("/admin/results", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminCreateAttendance: (payload) =>
    request("/admin/attendance", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminCreateAnnouncement: (payload) =>
    request("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminUpdateEnquiry: (id, status) =>
    request(`/admin/enquiries/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  adminCreateStudent: (payload) =>
    request("/admin/students", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  adminUpdateStudent: (id, payload) =>
    request(`/admin/students/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  adminDeleteStudent: (id) =>
    request(`/admin/students/${id}`, {
      method: "DELETE",
    }),
};

// =========================
// SESSION
// =========================

export function saveSession(data) {
  localStorage.setItem("idealhub_token", data.token);
  localStorage.setItem("idealhub_user", JSON.stringify(data.user));
}

export function getSessionUser() {
  try {
    return JSON.parse(
      localStorage.getItem("idealhub_user") || "null"
    );
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("idealhub_token");
  localStorage.removeItem("idealhub_user");
}

export { API_BASE };