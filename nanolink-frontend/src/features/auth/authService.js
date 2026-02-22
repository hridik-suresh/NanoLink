import API from "../../api/axiosInstance";

const register = (userData) => API.post("/auth/register", userData);
const login = (userData) => API.post("/auth/login", userData);

// For Google, we just redirect the window to the backend URL
const loginWithGoogle = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
};

export const authService = { register, login, loginWithGoogle };
