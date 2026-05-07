import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8082",
  headers: {
    "Content-Type": "application/json",
  },
});

// ── REQUEST INTERCEPTOR ──────────────────────────────────────────────────────
// Automatically attaches JWT token to every request if one exists in localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────────
// On 401 (token expired/invalid): clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;