import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, Activity, Clock, FileSearch, Info, Menu, X, CheckCircle2, AlertCircle } from "lucide-react";
import { checkHealth } from "../services/api";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [backendOnline, setBackendOnline] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const testHealth = async () => {
      const ok = await checkHealth();
      if (isMounted) setBackendOnline(ok);
    };
    testHealth();
    const interval = setInterval(testHealth, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const navLinks = [
    { to: "/", label: "Home", icon: Brain },
    { to: "/predict", label: "Predict", icon: Activity },
    { to: "/explain", label: "Explain AI", icon: FileSearch },
    { to: "/history", label: "History", icon: Clock },
    { to: "/about", label: "About", icon: Info },
  ];

  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center shadow-md group-hover:scale-105 transition">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">NeuroPilot</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 border border-blue-400/30 px-1.5 py-0.2 rounded font-mono font-medium">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-normal -mt-0.5 hidden sm:block">
                Clinical AI Decision Support
              </p>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    active
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-300 hover:text-white hover:bg-slate-800"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Backend Status Indicator & Start Button */}
          <div className="hidden md:flex items-center gap-4">
            <div
              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-full border ${
                backendOnline === true
                  ? "bg-emerald-950/60 text-emerald-300 border-emerald-800"
                  : backendOnline === false
                  ? "bg-rose-950/60 text-rose-300 border-rose-800"
                  : "bg-slate-800 text-slate-400 border-slate-700"
              }`}
              title={
                backendOnline === true
                  ? "FastAPI server running at http://127.0.0.1:8000"
                  : "Backend disconnected. Run: uvicorn api.main:app --port 8000"
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  backendOnline === true
                    ? "bg-emerald-400 animate-pulse"
                    : backendOnline === false
                    ? "bg-rose-500"
                    : "bg-slate-400"
                }`}
              />
              <span className="font-mono text-[11px]">
                {backendOnline === true
                  ? "API Online"
                  : backendOnline === false
                  ? "API Offline"
                  : "Connecting..."}
              </span>
            </div>

            <Link
              to="/predict"
              className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg shadow-sm transition"
            >
              New Scan
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  active ? "bg-blue-600 text-white" : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Server: http://127.0.0.1:8000</span>
            <span
              className={`font-semibold ${
                backendOnline ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {backendOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
