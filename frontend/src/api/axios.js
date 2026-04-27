import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1", // backend URL
  withCredentials: true, // important for auth (cookies)
});

export default axiosInstance;