import axios from "axios";
import plainAxios from "./plainAxios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const instance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed(newToken) {
  refreshSubscribers.forEach((callback) => callback(newToken));
  refreshSubscribers = [];
}

function addSubscriber(callback) {
  refreshSubscribers.push(callback);
}

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[API REQUEST]", config.method?.toUpperCase(), config.url, "-> headers:", config.headers);
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => {
    return response.data?.data ?? response.data ?? response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          addSubscriber((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(instance(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const res = await plainAxios.post("/auth/refresh", {}, { withCredentials: true });
        const newToken = res.data?.data?.token || res.data?.token;

        if (!newToken) throw new Error("No token returned from refresh API");

        localStorage.setItem("token", newToken);
        isRefreshing = false;
        onRefreshed(newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        redirectToLogin();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

function redirectToLogin() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export default instance;
