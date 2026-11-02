import axios from "axios";

const rawUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
const apiUrl = rawUrl.endsWith("/api") ? rawUrl : `${rawUrl}/api`;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("accessToken");
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    }

    , function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

export default api;