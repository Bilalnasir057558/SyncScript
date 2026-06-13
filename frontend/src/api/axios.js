import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`, // backend URL
  withCredentials: true, // important for auth (cookies)
});

export default axiosInstance;