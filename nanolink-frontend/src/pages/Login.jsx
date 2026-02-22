import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  authStart,
  authSuccess,
  authFailure,
} from "../features/auth/authSlice";
import { authService } from "../features/auth/authService";
import toast from "react-hot-toast";
import { LogIn, Mail, Lock } from "lucide-react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authStart());
    try {
      const { data } = await authService.login(formData);
      dispatch(authSuccess(data));
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      dispatch(authFailure(msg));
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          <p className="text-gray-500">Welcome back to NanoLink</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition-all hover:bg-blue-700 active:scale-95 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-200"></span>
          </div>
          <div className="relative flex justify-center text-sm uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          onClick={() => authService.loginWithGoogle()}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 py-2.5 transition-all hover:bg-gray-50 active:scale-95"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            className="h-5 w-5"
            alt="Google"
          />
          <span className="font-medium text-gray-700">Google</span>
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
