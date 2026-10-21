// Centralized API Client for Spring Boot Backend
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8085";

export class ApiError extends Error {
  constructor(status, message, data = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

/**
 * Universal fetch wrapper with timeout, JSON parsing, and unified error handling
 */
export async function apiRequest(endpoint, options = {}, timeoutMs = 8000) {
  const url = `${BACKEND_BASE_URL}${endpoint}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let authHeader = {};
  try {
    const saved = localStorage.getItem("medivault_auth_user");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.uid) {
        authHeader["Authorization"] = `Bearer ${parsed.token || parsed.uid}`;
      }
    }
  } catch (_) {}

  const defaultHeaders = {
    Accept: "application/json",
    ...authHeader,
  };

  if (!(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);


    // 204 No Content
    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get("content-type");
    const isJson = contentType && contentType.includes("application/json");
    const data = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      const errMsg = (data && data.message) || response.statusText || `Request failed with ${response.status}`;
      throw new ApiError(response.status, errMsg, data);
    }

    return data;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === "AbortError") {
      throw new ApiError(408, `Backend request timed out after ${timeoutMs}ms`);
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(0, err.message || "Network error connecting to MediVault backend");
  }
}

export { BACKEND_BASE_URL };
