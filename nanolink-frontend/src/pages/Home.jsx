import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Link2,
  Copy,
  Check,
  Zap,
  Shield,
  BarChart3,
  Loader2,
} from "lucide-react";
import API from "../api/axiosInstance";
import toast from "react-hot-toast";

const Home = () => {
  const [longUrl, setLongUrl] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check for logged-in status
  const isLoggedIn = !!localStorage.getItem("token");

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Clear previous results to avoid confusion
    setShortenedUrl(null);

    try {
      const { data } = await API.post("/url/create", {
        url: longUrl,
        customAlias: isLoggedIn ? customAlias || undefined : undefined,
      });

      // Backend sends 'shortUrl' directly in the response root ---
      if (data.success) {
        setShortenedUrl(data.shortUrl);
        setLongUrl(""); //clear input after success
        setCustomAlias("");
        toast.success("Link shortened successfully!");
      }
    } catch (err) {
      // Extract detailed backend error messages ---
      const errorMsg = err.response?.data?.message || "Failed to shorten URL";
      toast.error(errorMsg);
      console.error("Shortening error:", err);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!shortenedUrl) return;
    navigator.clipboard.writeText(shortenedUrl);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden px-6 pt-16 pb-24 lg:px-8 lg:pt-32">
        {/* Background Decoration */}
        <div className="absolute top-0 left-1/2 -z-10 h-150 w-150 -translate-x-1/2 opacity-10 sm:top-[-10%]">
          <div className="h-full w-full bg-blue-600 blur-[120px] rounded-full" />
        </div>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-5xl font-black tracking-tight text-slate-900 sm:text-7xl">
            Shorten. <span className="text-blue-600">Track.</span> Succeed.
          </h1>
          <p className="mt-6 text-lg leading-8 text-slate-600 font-medium">
            The professional URL shortener that gives you full control over your
            links and deep insights into your audience.
          </p>

          {/* Shortening Form */}
          <div className="mt-10 flex items-center justify-center">
            <div className="w-full max-w-2xl rounded-3xl bg-white p-2 shadow-2xl shadow-blue-200/50 border border-slate-100">
              <form
                onSubmit={handleShorten}
                className="flex flex-col md:flex-row gap-2"
              >
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Link2 className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Paste your long URL here..."
                    className="block w-full rounded-2xl border-0 py-4 pl-12 text-slate-900 ring-1 ring-inset ring-slate-100 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-600 sm:text-sm outline-none"
                    value={longUrl}
                    onChange={(e) => setLongUrl(e.target.value)}
                  />
                </div>

                {isLoggedIn && (
                  <input
                    type="text"
                    placeholder="Alias(optional)"
                    className="md:w-32 rounded-2xl border-0 py-4 px-4 text-slate-900 ring-1 ring-inset ring-slate-100 focus:ring-2 focus:ring-blue-600 sm:text-sm outline-none"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center rounded-2xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-sm hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all min-w-30"
                >
                  {loading ? (
                    <Loader2 className="animate-spin h-5 w-5" />
                  ) : (
                    "Shorten Now"
                  )}
                </button>
              </form>

              {/* Result Area */}
              {shortenedUrl && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2 p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <p className="font-bold text-blue-700 truncate mr-4">
                    {shortenedUrl}
                  </p>
                  <button
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-100 transition-colors shadow-sm"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
              )}
            </div>
          </div>

          {!isLoggedIn && (
            <p className="mt-4 text-sm text-slate-400">
              Want custom aliases and tracking?{" "}
              <Link
                to="/register"
                className="text-blue-600 font-bold hover:underline"
              >
                Create an account
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* Feature Section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <FeatureCard
            icon={<Zap className="text-amber-500" />}
            title="Lightning Fast"
            desc="Redirection is near-instant, ensuring your audience never waits."
          />
          <FeatureCard
            icon={<BarChart3 className="text-blue-500" />}
            title="Detailed Analytics"
            desc="Track location, device, and browser for every single click."
          />
          <FeatureCard
            icon={<Shield className="text-green-500" />}
            title="Secure & Reliable"
            desc="Your links are protected and guaranteed 99.9% uptime."
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
    <div className="mb-4 inline-block rounded-2xl bg-slate-50 p-3">{icon}</div>
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
    <p className="mt-2 text-slate-500 text-sm leading-relaxed">{desc}</p>
  </div>
);

export default Home;
