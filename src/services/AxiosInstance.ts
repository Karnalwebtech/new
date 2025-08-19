import { apiUrl } from "@/config";
import axios from "axios";

const axiosInstance = axios.create({
    baseURL: apiUrl, // Replace with your API base URL
});

axiosInstance.interceptors.request.use(
    (config) => {
        // Add custom headers or any other modifications here
        const token = localStorage.getItem('token')
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;