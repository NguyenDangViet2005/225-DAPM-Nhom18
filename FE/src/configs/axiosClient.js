import axios from "axios";

const API_URL =
  import.meta.env.VITE_BE_API_DOMAIN || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Send HttpOnly cookies automatically
});

// ─── Refresh Token Queue ────────────────────────────────────────────────────
// Prevents multiple concurrent refresh calls when several requests fail with 401
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach((prom) => (error ? prom.reject(error) : prom.resolve()));
  failedQueue = [];
};

const redirectToLogin = () => {
  window.location.href = "/login";
};
// ────────────────────────────────────────────────────────────────────────────

// Response interceptor: auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only handle 401 and skip the refresh endpoint itself to avoid infinite loop
    // Also skip /auth/me on initial load when not authenticated
    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/auth/refresh-token") ||
      originalRequest.url?.includes("/auth/me")
    ) {
      return Promise.reject(error);
    }

    // If a refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => apiClient(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Call refresh-token endpoint — cookies are sent automatically
      await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        { withCredentials: true },
      );

      // New accessToken is now in cookie; process queued requests
      processQueue(null);
      return apiClient(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid or expired — force logout
      processQueue(refreshError);
      redirectToLogin();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
