import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./component/layout/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SocialAuth from "./pages/SocialAuth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import API from "./api/axiosInstance";
import { authSuccess, logout } from "./features/auth/authSlice";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !user) {
      const loadUser = async () => {
        try {
          const { data } = await API.get("/auth/me");
          dispatch(authSuccess({ token, user: data.user }));
        } catch (err) {
          console.log(err);

          dispatch(logout());
        }
      };
      loadUser();
    }
  }, [dispatch, user]);

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navbar />
        <main>
          <Routes>
            <Route
              path="/"
              element={<div className="p-10">Hero Section Coming Soon!</div>}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            {/* The bridge for Google login */}
            <Route path="/social-auth" element={<SocialAuth />} />
            <Route
              path="/dashboard"
              element={<div className="p-10">Dashboard Page</div>}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
