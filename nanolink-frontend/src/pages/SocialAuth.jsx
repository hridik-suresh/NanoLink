import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess } from "../features/auth/authSlice";
import toast from "react-hot-toast";
import API from "../api/axiosInstance";

const SocialAuth = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      //  Immediately save the token so the Axios Interceptor can see it
      localStorage.setItem("token", token);

      const initializeUser = async () => {
        try {
          // Call the  /me endpoint
          const { data } = await API.get("/auth/me");

          // Dispatch boyh the token and the actual User data          
          dispatch(authSuccess({ token, user: data.user }));

          toast.success(`Welcome, ${data.user.name}!`);
          navigate("/dashboard");
        } catch (err) {
          console.error("Social Auth Fetch Error:", err);
          toast.error("Session initialization failed.");
          navigate("/login");
        }
      };

      initializeUser();
    } else {
      toast.error("Google login failed.");
      navigate("/login");
    }
  }, [searchParams, dispatch, navigate]);

  return (
    <div className="flex h-screen items-center justify-center">
      Processing Login...
    </div>
  );
};

export default SocialAuth;
