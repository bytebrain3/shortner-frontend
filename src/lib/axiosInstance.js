import axios from "axios";

// Get from .env
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://url.dipdev.xyz/";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // for sending cookies if you're using JWT in cookies
});

// Optional: Add interceptor to attach token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Handle responses globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., show toast, redirect to login, etc.)
    console.error("Axios error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosInstance;
