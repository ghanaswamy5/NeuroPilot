import React from "react";
import { Link } from "react-router-dom";
import { Brain, Activity, GitMerge, FileSearch, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white py-20 lg:py-28">
      {/* Decorative background neural glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Top Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>Multimodal Neural Diagnostic Engine</span>
          <span className="w-1 h-1 rounded-full bg-blue-400" />
          <span className="text-slate-300">EEG &bull; MRI &bull; Late Fusion</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
          AI-Powered Alzheimer's Detection with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
            Explainable Multimodal Fusion
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Screen for early Mild Cognitive Impairment (MCI) and Alzheimer's Disease (AD) by synthesizing
          19-channel electrophysiological EEG signals and 2D/3D structural brain MRI scans.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-0.5 text-sm sm:text-base"
          >
            <Activity className="w-4 h-4" />
            <span>Launch Prediction Pipeline</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/explain"
            className="inline-flex items-center gap-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition text-sm sm:text-base"
          >
            <FileSearch className="w-4 h-4 text-cyan-400" />
            <span>Grad-CAM Explainability</span>
          </Link>
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-16 pt-10 border-t border-slate-800/80 grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Activity className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modality 1</span>
            </div>
            <h4 className="font-bold text-white text-base">EEG Transformer</h4>
            <p className="text-xs text-slate-400 mt-1">19-channel temporal power spectrum attention</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <Brain className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modality 2</span>
            </div>
            <h4 className="font-bold text-white text-base">Deep MRI CNN</h4>
            <p className="text-xs text-slate-400 mt-1">Structural convolutional feature extraction</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 mb-1">
              <GitMerge className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Modality 3</span>
            </div>
            <h4 className="font-bold text-white text-base">Weighted Fusion</h4>
            <p className="text-xs text-slate-400 mt-1">40% EEG + 60% MRI probability consensus</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold uppercase tracking-wider">Validation</span>
            </div>
            <h4 className="font-bold text-white text-base">3-Class Triage</h4>
            <p className="text-xs text-slate-400 mt-1">Cognitively Normal &bull; MCI &bull; Alzheimer's</p>
          </div>
        </div>
      </div>
    </section>
  );
}
