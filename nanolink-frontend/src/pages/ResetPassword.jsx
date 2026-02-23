import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";
import { Lock, CheckCircle } from "lucide-react";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { token } = useParams(); // Grabs the token from the URL
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await API.patch(`/auth/reset-password/${token}`, { password });
      toast.success("Password updated! You can now login.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Link expired or invalid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Set New Password
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="relative">
            <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white transition-all hover:bg-green-700"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
