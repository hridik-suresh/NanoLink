import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link as LinkIcon,
  MousePointer2,
  Copy,
  Loader2,
  Globe,
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- 1. NEW STATE: Pagination ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [isShortening, setIsShortening] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [newAlias, setNewAlias] = useState("");

  const fetchDashboardData = async () => {
    try {
      // --- 2. UPDATE: Pass pagination params to the request ---
      const { data } = await API.get(
        `/analytics/dashboard?page=${currentPage}&limit=${itemsPerPage}`,
      );
      setStats(data.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // --- 3. UPDATE: Re-run effect when currentPage changes ---
  useEffect(() => {
    fetchDashboardData();
  }, [currentPage]);

  const handleShorten = async (e) => {
    e.preventDefault();
    setIsShortening(true);
    try {
      await API.post("/url/create", {
        url: longUrl,
        customAlias: customAlias || undefined,
      });
      toast.success("Link created!");
      setLongUrl("");
      setCustomAlias("");
      setCurrentPage(1); // Optional: Reset to page 1 to see the new link
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating link");
    } finally {
      setIsShortening(false);
    }
  };

  const openEditModal = (e, link) => {
    e.stopPropagation();
    setSelectedLink(link);
    setNewAlias(link.shortId);
    setIsEditModalOpen(true);
  };

  const confirmEdit = async () => {
    try {
      await API.patch(`/url/${selectedLink._id}`, { newAlias });
      toast.success("Alias updated!");
      setIsEditModalOpen(false);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const openDeleteModal = (e, id) => {
    e.stopPropagation();
    setSelectedLink({ _id: id });
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await API.delete(`/url/${selectedLink._id}`);
      toast.success("Link deleted successfully");
      if (stats?.links?.length === 1 && currentPage > 1) {
        setCurrentPage((prev) => prev - 1); // Go back a page if the user deleted the last item on the current page
      }
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
    toast.success("Copied!");
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );

  return (
    <div className="mx-auto max-w-7xl p-6 lg:p-8">
      {/* Stat Cards */}
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

      {/* Form */}
      <div className="mb-10 rounded-3xl bg-white p-8 shadow-sm border border-slate-200">
        <form
          onSubmit={handleShorten}
          className="grid grid-cols-1 gap-4 md:grid-cols-4"
        >
          <div className="md:col-span-2">
            <input
              type="text"
              placeholder="https://example.com"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Alias (optional)"
            className="w-full rounded-2xl border border-slate-200 px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
            value={customAlias}
            onChange={(e) => setCustomAlias(e.target.value)}
          />
          <button
            disabled={isShortening}
            className="rounded-2xl bg-blue-600 font-bold text-white hover:bg-blue-700"
          >
            {isShortening ? (
              <Loader2 className="animate-spin mx-auto" />
            ) : (
              "Shorten Now"
            )}
          </button>
        </form>
      </div>

      {/* Table with Pagination Footer */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 border-b border-slate-100">
            <tr>
              <th className="px-8 py-5 text-sm font-bold text-slate-500">
                Link Details
              </th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 text-center">
                Clicks
              </th>
              <th className="px-8 py-5 text-sm font-bold text-slate-500 text-right">
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
                    <span className="font-bold text-slate-900 group-hover:text-blue-600">
                      {link.shortId}
                    </span>
                    <span className="text-xs text-slate-400 truncate max-w-xs">
                      {link.originalUrl}
                    </span>
                  </div>
                </td>
                <td className="px-8 py-6 text-center">{link.clicks}</td>
                <td className="px-8 py-6">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={(e) => copyLink(e, link.shortId)}
                      className="p-2 text-slate-400 hover:text-blue-600"
                    >
                      <Copy size={18} />
                    </button>
                    <button
                      onClick={(e) => openEditModal(e, link)}
                      className="p-2 text-slate-400 hover:text-amber-500"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      onClick={(e) => openDeleteModal(e, link._id)}
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

        {/* --- 4. NEW: Pagination UI --- */}
        {stats?.totalPages > 1 && (
          <div className="flex items-center justify-between px-8 py-4 bg-slate-50/50 border-t border-slate-100">
            <p className="text-sm text-slate-500">
              Showing page{" "}
              <span className="font-bold text-slate-900">{currentPage}</span> of{" "}
              <span className="font-bold text-slate-900">
                {stats.totalPages}
              </span>
            </p>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                <ChevronLeft size={16} /> Previous
              </button>
              <button
                disabled={currentPage === stats.totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-slate-50 disabled:opacity-50 transition-all"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* --- EDIT MODAL --- */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h3 className="text-2xl font-black text-slate-900 mb-4">
              Edit Alias
            </h3>
            <input
              type="text"
              className="w-full rounded-2xl border border-slate-200 px-5 py-4 mb-6 outline-none focus:ring-2 focus:ring-blue-500"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
            />
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold"
              >
                Cancel
              </button>
              <button
                onClick={confirmEdit}
                className="flex-1 rounded-2xl bg-blue-600 py-4 font-bold text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- DELETE MODAL --- */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-2xl text-center">
            <Trash2 size={40} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-bold">Confirm Delete?</h3>
            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 rounded-2xl bg-slate-100 py-4 font-bold"
              >
                No
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 rounded-2xl bg-red-600 py-4 font-bold text-white"
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
  <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4 mb-4">
      <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
      <span className="text-xs font-bold uppercase text-slate-400">
        {title}
      </span>
    </div>
    <p className="text-4xl font-black text-slate-900">{value ?? 0}</p>
  </div>
);

export default Dashboard;
