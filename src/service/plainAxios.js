import axios from "axios";

const plainAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

plainAxios.interceptors.request.use((config) => {
  let deviceId = localStorage.getItem("deviceId");

  if (!deviceId || deviceId === "undefined") {
    deviceId = crypto.randomUUID();
    localStorage.setItem("deviceId", deviceId);
  }

  config.headers["X-Device-Id"] = deviceId;
  return config;
});

export default plainAxios;
