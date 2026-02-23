import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  ArrowLeft,
  Calendar,
  MousePointer2,
  Globe,
  Laptop,
} from "lucide-react";
import API from "../api/axiosInstance";
// import Loader from "../components/ui/Loader"; // Assume a simple spinner

const LinkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await API.get(`/analytics/url/${id}`);
        setData(res.data.data);
      } catch (err) {
        console.log(err);
        
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center font-bold">
        Loading Analytics...
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-6">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors"
      >
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 truncate">
          {data.urlDetails.shortId}
        </h1>
        <p className="text-slate-500 truncate">{data.urlDetails.originalUrl}</p>
      </div>

      {/* 📈 Clicks Over Time Chart */}
      <div className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-800">
          <Calendar size={20} className="text-blue-600" /> Clicks (Last 7 Days)
        </h3>
        <div className="h-75 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.clickHistory}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />
              <XAxis
                dataKey="_id"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#94a3b8", fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="clicks"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 6, fill: "#3b82f6" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Recent Activity Table */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-800 flex items-center gap-2">
            <MousePointer2 size={18} className="text-green-600" /> Recent
            Activity
          </h3>
          <div className="space-y-4">
            {data.recentClicks.map((click, i) => (
              <div
                key={i}
                className="flex justify-between items-center text-sm border-b border-slate-50 pb-2"
              >
                <span className="font-medium text-slate-700">
                  {click.browser} on {click.os.split(" ")[0]}
                </span>
                <span className="text-slate-400">
                  {new Date(click.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Distribution (Simple Bar Chart) */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-bold text-slate-800 flex items-center gap-2">
            <Laptop size={18} className="text-purple-600" /> Device Types
          </h3>
          <p className="text-sm text-slate-500 mb-4">
            Breakdown of user hardware
          </p>
          <div className="space-y-3">
            {/* You can map device distribution here or use a Pie chart */}
            {data.recentClicks.length === 0 && (
              <p className="text-center py-10 text-slate-400">
                No device data yet
              </p>
            )}
            {/* Dynamic Bar showing browser usage */}
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500"
                  style={{ width: "70%" }}
                ></div>
              </div>
              <span className="text-xs font-bold">Desktop</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkDetails;
