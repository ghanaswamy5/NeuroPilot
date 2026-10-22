import React from "react";
import { Brain, ShieldCheck, Activity, Cpu } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-12 mt-20 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span>NeuroPilot Diagnostic System</span>
            </div>
            <p className="text-slate-400 leading-relaxed max-w-md">
              A clinical decision support platform utilizing dual-modality deep learning.
              Combines 19-channel EEG signals and structural T1 MRI scans for early detection of
              Alzheimer's Disease (AD) and Mild Cognitive Impairment (MCI).
            </p>
            <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                PyTorch 2.x
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                FastAPI Backend
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Grad-CAM XAI
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                SQLite Persistence
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Diagnostic Tools</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/predict" className="hover:text-white transition">
                  Multi-Modal Prediction
                </Link>
              </li>
              <li>
                <Link to="/explain" className="hover:text-white transition">
                  Grad-CAM Heatmap Explorer
                </Link>
              </li>
              <li>
                <Link to="/history" className="hover:text-white transition">
                  Audit History Records
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">
                  Methodology & Pipeline
                </Link>
              </li>
            </ul>
          </div>

          {/* Research & Compliance Note */}
          <div>
            <h4 className="font-semibold text-slate-200 text-sm mb-3">Clinical Notice</h4>
            <div className="p-3 bg-slate-800/80 rounded-lg border border-slate-700 text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Decision Support Only</span>
              </div>
              <p>
                NeuroPilot predictions are intended for research and investigative assistance. All
                findings should be corroborated by licensed clinical neurological assessments.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 NeuroPilot Project. Built for clinical neurology & deep learning evaluation.</p>
          <p className="flex items-center gap-3">
            <span>OASIS MRI Dataset</span>
            &bull;
            <span>10-20 EEG Montage</span>
            &bull;
            <span>Late Fusion Model</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
