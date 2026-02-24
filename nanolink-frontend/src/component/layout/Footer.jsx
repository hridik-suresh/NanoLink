const Footer = () => {
  return (
    <footer className="w-full py-12 border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
        {/* Social Links */}
        <div className="flex items-center gap-8">
          <a
            href="https://github.com/hridik-suresh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-600 font-semibold text-sm transition-all hover:-translate-y-1"
          >
            Github
          </a>

          {/* Decorative Dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />

          <a
            href="https://www.linkedin.com/in/hridiksuresh/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-blue-600 font-semibold text-sm transition-all hover:-translate-y-1"
          >
            LinkedIn
          </a>
        </div>

        {/* Branding & Attribution */}
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-slate-500 text-sm font-medium">
            © {new Date().getFullYear()}{" "}
            <span className="text-slate-900 font-black tracking-tight">
              NanoLink
            </span>
          </p>

          <p className="text-slate-400 text-xs italic">
            Crafted with{" "}
            <span className="text-red-500 animate-pulse not-italic">❤️</span> by{" "}
            <span className="text-blue-600 not-italic font-bold hover:underline decoration-2 underline-offset-4 cursor-pointer">
              hridik_
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
