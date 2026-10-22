import React from "react";

export default function ProbabilityBar({ label, value, isDominant = false }) {
  const meta = {
    AD: {
      title: "AD (Alzheimer's Disease)",
      color: "bg-rose-500",
      track: "bg-rose-50",
      textColor: "text-rose-700",
    },
    MCI: {
      title: "MCI (Mild Cognitive Impairment)",
      color: "bg-amber-500",
      track: "bg-amber-50",
      textColor: "text-amber-700",
    },
    CN: {
      title: "CN (Cognitively Normal)",
      color: "bg-emerald-500",
      track: "bg-emerald-50",
      textColor: "text-emerald-700",
    },
  };

  const current = meta[label] || {
    title: label,
    color: "bg-blue-600",
    track: "bg-slate-100",
    textColor: "text-slate-700",
  };

  const percentage = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className={`p-3 rounded-lg border transition-all ${isDominant ? "border-slate-300 bg-white shadow-xs" : "border-slate-100 bg-slate-50/50"}`}>
      <div className="flex justify-between items-center mb-1.5 text-xs sm:text-sm">
        <span className={`font-medium ${current.textColor} flex items-center gap-1.5`}>
          {isDominant && (
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
          )}
          {current.title}
        </span>
        <span className="font-semibold text-slate-900 tabular-nums">
          {percentage.toFixed(2)}%
        </span>
      </div>

      <div className={`w-full h-2.5 rounded-full overflow-hidden ${current.track}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${current.color}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
