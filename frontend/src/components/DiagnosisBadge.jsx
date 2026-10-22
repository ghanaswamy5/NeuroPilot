import React from "react";
import { CheckCircle2, AlertTriangle, AlertOctagon } from "lucide-react";

export default function DiagnosisBadge({ diagnosis, size = "md", showDescription = false }) {
  const configs = {
    CN: {
      label: "Cognitively Normal (CN)",
      short: "CN",
      desc: "Healthy control profile without evidence of dementia or progressive cognitive decline.",
      bg: "bg-emerald-50 text-emerald-800 border-emerald-300 ring-emerald-500/20",
      dot: "bg-emerald-500",
      icon: CheckCircle2,
    },
    MCI: {
      label: "Mild Cognitive Impairment (MCI)",
      short: "MCI",
      desc: "Early transition state; measurable cognitive deficits exceeding normal aging parameters.",
      bg: "bg-amber-50 text-amber-800 border-amber-300 ring-amber-500/20",
      dot: "bg-amber-500",
      icon: AlertTriangle,
    },
    AD: {
      label: "Alzheimer's Disease (AD)",
      short: "AD",
      desc: "Significant neurodegenerative pattern consistent with Alzheimer's dementia pathology.",
      bg: "bg-rose-50 text-rose-800 border-rose-300 ring-rose-500/20",
      dot: "bg-rose-500",
      icon: AlertOctagon,
    },
  };

  const config = configs[diagnosis] || {
    label: diagnosis || "Unknown",
    short: diagnosis || "Unknown",
    desc: "Unclassified diagnostic category",
    bg: "bg-slate-100 text-slate-700 border-slate-300 ring-slate-500/20",
    dot: "bg-slate-400",
    icon: AlertTriangle,
  };

  const Icon = config.icon;

  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-5 py-2.5 text-base font-semibold",
  };

  return (
    <div className="inline-flex flex-col">
      <span
        className={`inline-flex items-center gap-2 rounded-full border shadow-xs font-medium ring-1 ${config.bg} ${sizeClasses[size]}`}
      >
        <span className={`w-2 h-2 rounded-full ${config.dot} animate-pulse`} />
        <Icon className={size === "lg" ? "w-5 h-5" : "w-4 h-4"} />
        <span>{size === "sm" ? config.short : config.label}</span>
      </span>
      {showDescription && (
        <p className="mt-1.5 text-xs text-slate-500 max-w-xs">{config.desc}</p>
      )}
    </div>
  );
}
