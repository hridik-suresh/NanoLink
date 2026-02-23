import { useState, useEffect } from "react";
import {
  Plus,
  Link as LinkIcon,
  MousePointer2,
  Copy,
  ExternalLink,
  Loader2,
  Globe,
  Trash2,
  Edit3,
} from "lucide-react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState(""); // Added for alias support
  const [isShortening, setIsShortening] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get("/analytics/dashboard");
      setStats(data.data);
    } catch (err) {
      console.log(err);

      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    setIsShortening(true);
    try {
      // Updated to match your route: POST /api/url/create
      await API.post("/url/create", {
        originalUrl: longUrl,
        customAlias: customAlias || undefined,
      });
      toast.success("Link created!");
      setLongUrl("");
      setCustomAlias("");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error");
    } finally {
      setIsShortening(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this link forever?")) return;
    try {
      await API.delete(`/url/${id}`); // Matches DELETE /api/url/:id
      toast.success("Link deleted");
      fetchDashboardData();
    } catch (err) {
      console.log(err);

      toast.error("Delete failed");
    }
  };

  const copyLink = (code) => {
    const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Copied!");
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-6">
      {/* 📊 Stats Section */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          icon={<LinkIcon size={20} />}
          title="Links"
          value={stats?.totalLinks}
        />
        <StatCard
          icon={<MousePointer2 size={20} />}
          title="Clicks"
          value={stats?.totalClicks}
        />
        <StatCard
          icon={<Globe size={20} />}
          title="Top Source"
          value={stats?.breakdowns?.countries[0]?._id || "N/A"}
        />
      </div>

      {/* 🚀 Create Section */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Plus size={20} className="text-blue-600" /> Shorten a new link
        </h2>
        <form
          onSubmit={handleShorten}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <input
            type="url"
            placeholder="Paste long URL..."
            className="md:col-span-2 rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={longUrl}
            onChange={(e) => setLongUrl(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Alias (optional)"
            className="rounded-xl border border-slate-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />
          <button
            disabled={isShortening}
            className="rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {isShortening ? "Creating..." : "Shorten"}
          </button>
        </form>
      </div>

      {/* 🔗 List Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">
                Original Link
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">
                Clicks
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stats?.links?.map((link) => (
              <tr
                key={link._id}
                className="hover:bg-slate-50/50 transition-colors"
              >
                <td className="px-6 py-4">
                  <p className="font-bold text-blue-600 truncate max-w-50">
                    {link.shortCode || link.alias}
                  </p>
                  <p className="text-xs text-slate-400 truncate max-w-62.5">
                    {link.originalUrl}
                  </p>
                </td>
                <td className="px-6 py-4 text-center font-medium text-slate-700">
                  {link.clicks}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => copyLink(link.shortCode || link.alias)}
                      className="p-2 text-slate-400 hover:text-blue-600"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(link._id)}
                      className="p-2 text-slate-400 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!stats?.links || stats.links.length === 0) && (
          <div className="p-10 text-center text-slate-400">
            No links yet. Start shortening!
          </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center gap-3 text-slate-500 mb-1">
      {icon}{" "}
      <span className="text-xs font-bold uppercase tracking-wider">
        {title}
      </span>
    </div>
    <p className="text-2xl font-black text-slate-800">{value || 0}</p>
  </div>
);

export default Dashboard;
