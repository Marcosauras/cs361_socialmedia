import axios from "axios";

const apiClient = axios.create({
  // will host on localhost:8080 by default
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
  timeout: 8000,
});
// This will create an axios instance with a base URL and timeout
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
// This interceptor will run before every request to add the token if it exists
// It will also handle the case where the token is invalid or expired
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // when the token is invalid or expired 
      localStorage.removeItem("token");
      window.location = "/login";
    }
    return Promise.reject(err);
  }
);

export default apiClient;