import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { authSuccess } from "../features/auth/authSlice";
import toast from "react-hot-toast";

const SocialAuth = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      
      // Update state and redirect
      dispatch(authSuccess({ token, user: null }));
      toast.success("Logged in with Google!");
      navigate("/dashboard");
    } else {
      toast.error("Google login failed");
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
