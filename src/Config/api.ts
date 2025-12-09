import axios from "axios";

// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = "http://localhost:5000/api";


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