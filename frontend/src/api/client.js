// src/api/client.js

const BASE_URL = import.meta.env.VITE_API_URL;

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getCookie(name) {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function extractErrorMessage(data) {
  if (!data) return null;
  if (typeof data.detail === "string") return data.detail;
  if (Array.isArray(data)) {
    return data.filter((item) => typeof item === "string").join(" ");
  }
  if (typeof data === "object") {
    const messages = Object.values(data)
      .flat()
      .filter((item) => typeof item === "string");
    if (messages.length) return messages.join(" ");
  }
  return null;
}

export async function apiFetch(path, { method = "GET", body, headers, ...rest } = {}) {
  const init = {
    method,
    credentials: "include",
    headers: { ...headers },
    ...rest,
  };

  if (!SAFE_METHODS.has(method.toUpperCase())) {
    const csrfToken = getCookie("csrftoken");
    if (csrfToken) {
      init.headers["X-CSRFToken"] = csrfToken;
    }
  }

  if (body !== undefined) {
    init.headers["Content-Type"] = "application/json";
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, init);

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    const message = extractErrorMessage(data) || `Request failed (${response.status}).`;
    throw new ApiError(message, response.status, data);
  }

  return data;
}

export const fetchCsrfCookie = () => apiFetch("/api/auth/csrf/");
export const registerRequest = (payload) =>
  apiFetch("/api/auth/register/", { method: "POST", body: payload });
export const loginRequest = (payload) =>
  apiFetch("/api/auth/login/", { method: "POST", body: payload });
export const logoutRequest = () => apiFetch("/api/auth/logout/", { method: "POST" });
export const meRequest = () => apiFetch("/api/auth/me/");