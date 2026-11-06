import axios from "axios";
import { notifyErrorDeferred } from "../Utils/notify";

const DEFAULT_API_ORIGIN = "https://api.smartdrive.io.vn";

const rawUrl = String(
  import.meta.env.VITE_API_URL || DEFAULT_API_ORIGIN
).replace(/\/+$/, "");
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
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (config.headers) {
      delete config.headers.Authorization;
    }
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