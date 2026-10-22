import React from "react";
import DiagnosisBadge from "./DiagnosisBadge";
import { Activity, Brain, GitMerge } from "lucide-react";

export default function ResultCard({
  title,
  prediction,
  confidence,
  modality = "mri", // 'eeg', 'mri', 'fusion'
  children,
}) {
  const icons = {
    eeg: Activity,
    mri: Brain,
    fusion: GitMerge,
  };

  const Icon = icons[modality.toLowerCase()] || Brain;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 transition mb-6">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500">Model Inference Output</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block">
              Confidence
            </span>
            <span className="text-lg font-bold text-slate-900 tabular-nums">
              {Number(confidence).toFixed(2)}%
            </span>
          </div>
          <DiagnosisBadge diagnosis={prediction} size="md" />
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
}
