import React from "react";
import { Activity, Brain, GitMerge, Sparkles } from "lucide-react";

export default function ModeSelector({ mode, setMode }) {
  const options = [
    {
      value: "eeg",
      label: "EEG Analysis",
      subtitle: "19-Channel Brainwave Transformer",
      icon: Activity,
      badge: "Electrophysiology",
    },
    {
      value: "mri",
      label: "MRI Analysis",
      subtitle: "Structural Scan Deep CNN",
      icon: Brain,
      badge: "Neuroimaging",
    },
    {
      value: "fusion",
      label: "Multimodal Fusion",
      subtitle: "Weighted Late Fusion (40% EEG + 60% MRI)",
      icon: GitMerge,
      badge: "Highest Reliability",
      highlight: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
      {options.map((item) => {
        const Icon = item.icon;
        const isSelected = mode === item.value;

        return (
          <button
            key={item.value}
            type="button"
            onClick={() => setMode(item.value)}
            className={`relative p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between ${
              isSelected
                ? "bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-500/30"
                : "bg-white text-slate-800 border-slate-200 hover:border-slate-300 hover:bg-slate-50/70"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    isSelected
                      ? "bg-white/20 text-white"
                      : item.highlight
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.highlight && <Sparkles className="w-3 h-3" />}
                  {item.badge}
                </span>
              </div>
              <h3 className="font-semibold text-base">{item.label}</h3>
              <p
                className={`text-xs mt-1 leading-relaxed ${
                  isSelected ? "text-blue-100" : "text-slate-500"
                }`}
              >
                {item.subtitle}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-current/10 flex items-center justify-between text-xs font-medium">
              <span>{isSelected ? "Active Pipeline" : "Select Pipeline"}</span>
              <span className={`w-2 h-2 rounded-full ${isSelected ? "bg-white" : "bg-slate-300"}`} />
            </div>
          </button>
        );
      })}
    </div>
  );
}
