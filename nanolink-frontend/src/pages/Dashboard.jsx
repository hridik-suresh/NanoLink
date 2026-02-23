import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Link as LinkIcon,
  MousePointer2,
  Copy,
  ExternalLink,
  Loader2,
  Globe,
  Trash2,
  BarChart3,
} from "lucide-react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isShortening, setIsShortening] = useState(false);

  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const { data } = await API.get("/analytics/dashboard");
      setStats(data.data);
    } catch (err) {
      console.log(err);

      toast.error("Failed to load dashboard data");
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
      // Backend expects 'url' and 'customAlias'
      await API.post("/url/create", {
        url: longUrl,
        customAlias: customAlias || undefined,
      });
      toast.success("Link created!");
      setLongUrl("");
      setCustomAlias("");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating link");
    } finally {
      setIsShortening(false);
    }
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation(); // Prevents navigating to details page
    setSelectedLinkId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/url/${selectedLinkId}`);
      toast.success("Link deleted successfully");
      setIsDeleteModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      console.log(err);

      toast.error("Could not delete link");
    }
  };

  const copyLink = (e, code) => {
    e.stopPropagation();
    const fullUrl = `${import.meta.env.VITE_BACKEND_URL}/${code}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success("Copied to clipboard!");
  };

  if (loading)
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* 📊 Stats Section */}
      <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard
          icon={<LinkIcon className="text-blue-600" />}
          title="Total Links"
          value={stats?.totalLinks}
        />
        <StatCard
          icon={<MousePointer2 className="text-green-600" />}
          title="Total Clicks"
          value={stats?.totalClicks}
        />
        <StatCard
          icon={<Globe className="text-purple-600" />}
          title="Top Country"
          value={stats?.breakdowns?.countries[0]?._id || "N/A"}
        />
      </div>

      {/* 🚀 Shorten Form */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold mb-6 text-slate-800">
          Shorten a new URL
        </h2>
        <form
          onSubmit={handleShorten}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div className="md:col-span-2">
            <input
              type="url"
              placeholder="https://example.com/very-long-link"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Custom alias (optional)"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
          <button
            disabled={isShortening}
            className="rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all active:scale-95 shadow-lg shadow-blue-100"
          >
            {isShortening ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Shorten Now"
            )}
          </button>
        </form>
      </div>

      {/* 🔗 Links Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider">
                  Link Details
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-center">
                  Clicks
                </th>
                <th className="px-8 py-5 text-sm font-bold text-slate-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.links?.map((link) => (
                <tr
                  key={link._id}
                  onClick={() => navigate(`/dashboard/stats/${link._id}`)}
                  className="group cursor-pointer hover:bg-blue-50/30 transition-all"
                >
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-lg">
                        {link.shortId}
                      </span>
                      <span className="text-sm text-slate-400 truncate max-w-xs md:max-w-md">
                        {link.originalUrl}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold">
                      {link.clicks}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={(e) => copyLink(e, link.shortId)}
                        className="p-3 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-blue-100 shadow-sm"
                        title="Copy Link"
                      >
                        <Copy size={18} />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(e, link._id)}
                        className="p-3 text-slate-400 hover:text-red-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-red-100 shadow-sm"
                        title="Delete Link"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {(!stats?.links || stats.links.length === 0) && (
          <div className="p-20 text-center">
            <div className="inline-flex p-6 rounded-full bg-slate-50 mb-4">
              <LinkIcon size={40} className="text-slate-200" />
            </div>
            <p className="text-slate-500 font-medium">
              No links found. Create your first one above!
            </p>
          </div>
        )}
      </div>

      {/* 🗑️ Professional Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsDeleteModalOpen(false)}
          ></div>
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-500">
              <Trash2 size={40} />
            </div>
            <h3 className="text-center text-2xl font-black text-slate-900">
              Confirm Deletion
            </h3>
            <p className="mt-4 text-center text-slate-500 leading-relaxed">
              Are you sure you want to delete this link? This will permanently
              erase all tracking data and analytics. This action cannot be
              undone.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold text-slate-600 hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-red-600 py-4 font-bold text-white hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, title, value }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
        {title}
      </span>
    </div>
    <p className="text-4xl font-black text-slate-900">{value ?? 0}</p>
  </div>
);

export default Dashboard;
