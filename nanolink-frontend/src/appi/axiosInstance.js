import axios from "axios";

// Create an instance of axios
const API = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
});

// "Interceptor" - it runs BEFORE every request
API.interceptors.request.use((req) => {
  // Look for the token in LocalStorage
  const token = localStorage.getItem("token");

  if (token) {
    // Attach the Bearer token to headers (matches the backend protect middleware!)
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// This handles responses - useful for catching "Token Expired" errors
API.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the backend says unauthorized, clear storage and logout
      localStorage.removeItem("token");
      
    }
    return Promise.reject(error);
  },
);

export default API;
