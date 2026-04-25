import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/v1/users", // backend URL
  withCredentials: true, // important for auth (cookies)
});

export default API;