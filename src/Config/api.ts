import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api/",
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