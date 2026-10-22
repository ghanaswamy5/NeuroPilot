import React from "react";
import { Link } from "react-router-dom";
import { Activity, FileSearch, ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Ready to Evaluate EEG or MRI Scans?
        </h2>
        <p className="mt-3 text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
          Upload preprocessed electrophysiological arrays or brain MRI slices to generate instant
          triaged classifications with full probability distribution.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 bg-white text-blue-800 hover:bg-blue-50 font-semibold px-6 py-3 rounded-xl shadow-md transition text-sm sm:text-base"
          >
            <Activity className="w-4 h-4 text-blue-600" />
            <span>Start Prediction</span>
            <ArrowRight className="w-4 h-4 text-blue-600" />
          </Link>

          <Link
            to="/explain"
            className="inline-flex items-center gap-2 bg-blue-900/60 hover:bg-blue-900 text-white border border-blue-400/40 font-semibold px-6 py-3 rounded-xl transition text-sm sm:text-base"
          >
            <FileSearch className="w-4 h-4 text-cyan-300" />
            <span>Generate Grad-CAM</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
