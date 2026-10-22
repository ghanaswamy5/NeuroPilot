import React from "react";
import { Link } from "react-router-dom";
import { Brain, ArrowLeft, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto py-24 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
        <Brain className="w-8 h-8" />
      </div>
      <span className="font-mono text-sm font-semibold text-blue-600">404 &bull; Error</span>
      <h1 className="text-3xl font-bold text-slate-900 mt-1">Page Not Found</h1>
      <p className="mt-2 text-xs sm:text-sm text-slate-500 leading-relaxed">
        The diagnostic view or clinical resource you requested does not exist or has been relocated.
      </p>

      <div className="mt-6 flex justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-slate-800 transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span>Home</span>
        </Link>
        <Link
          to="/predict"
          className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-4 py-2 rounded-xl text-xs hover:bg-blue-500 transition"
        >
          <span>Run Prediction</span>
        </Link>
      </div>
    </div>
  );
}
