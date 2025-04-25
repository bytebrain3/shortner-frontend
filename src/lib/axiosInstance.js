import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://url.dipdev.xyz/", // or just set it in .env
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
