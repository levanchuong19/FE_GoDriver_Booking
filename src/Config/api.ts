import axios from "axios";
import { notifyErrorDeferred } from "../Utils/notify";

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
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const skip = Boolean(
      error?.config?.skipErrorToast || error?.config?.headers?.["X-Skip-Error-Toast"]
    );
    if (!skip && !axios.isCancel(error)) {
      notifyErrorDeferred(error, "Đã xảy ra lỗi. Vui lòng thử lại.");
    }
    return Promise.reject(error);
  }
);

export default api;