import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  TrendingUp,
  Clock,
  Globe,
  Monitor,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const LinkDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Matching your paginated controller route
        const response = await API.get(
          `/analytics/url/${id}?page=${currentPage}&limit=${itemsPerPage}`,
        );
        setData(response?.data?.data);
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not load analytics");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, navigate, currentPage]);

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  if (!data || !data.urlDetails) return null;

  const { urlDetails, clickHistory, analytics, pagination } = data;

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header Navigation */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-semibold group"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Back to Dashboard
      </button>

      {/* Hero Section */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex-1 min-w-0">
          <h1 className="text-4xl font-black text-slate-900 truncate mb-2">
            /{urlDetails.shortId}
          </h1>
          <a
            href={urlDetails.originalUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-slate-400 hover:text-blue-500 break-all transition-colors font-medium"
          >
            {urlDetails.originalUrl} <ExternalLink size={14} />
          </a>
        </div>

        <div className="bg-white px-8 py-5 rounded-3xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
            Total Clicks
          </p>
          <p className="text-4xl font-black text-blue-600">
            {urlDetails.clicks}
          </p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
            <TrendingUp size={20} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            Activity (Last 7 Days)
          </h2>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={clickHistory}>
              <defs>
                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
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
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="clicks"
                stroke="#2563eb"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorClicks)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Analytics Table */}
      <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
              <Clock size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Detailed Log</h2>
          </div>
          <span className="text-sm font-medium text-slate-400">
            Showing {analytics.length} results
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Visitor Info
                </th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Location
                </th>
                <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {analytics.length > 0 ? (
                analytics.map((click) => (
                  <tr
                    key={click._id}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Monitor size={14} className="text-slate-400" />
                          <span className="font-bold text-slate-700 text-sm">
                            {click.device} • {click.browser}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Cpu size={12} /> {click.os || "Unknown OS"}
                          </span>
                          <span className="flex items-center gap-1">
                            <ShieldCheck size={12} />{" "}
                            {click.ipAddress || "0.0.0.0"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2 text-slate-600 font-medium text-sm">
                        <Globe size={16} className="text-slate-400" />
                        {click.city
                          ? `${click.city}, ${click.country}`
                          : "Unknown Location"}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right text-sm text-slate-500 font-medium">
                      {new Date(click.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="3"
                    className="px-8 py-10 text-center text-slate-400 italic"
                  >
                    No activity yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-8 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500 font-medium">
            Page{" "}
            <span className="text-slate-900">{pagination.currentPage}</span> of{" "}
            <span className="text-slate-900">{pagination.totalPages}</span>
          </p>
          <div className="flex gap-2">
            <button
              disabled={pagination.currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={!pagination.hasNextPage}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkDetails;
