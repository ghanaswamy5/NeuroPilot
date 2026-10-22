import React from "react";
import ProbabilityBar from "./ProbabilityBar";
import { Activity, ShieldCheck, AlertTriangle } from "lucide-react";

export default function ProbabilityChart({ probabilities = {}, predictedClass = "" }) {
  const entries = Object.entries(probabilities);
  if (entries.length === 0) return null;

  const adProb = Number(probabilities.AD || 0);
  const mciProb = Number(probabilities.MCI || 0);
  const cnProb = Number(probabilities.CN || 0);

  // Compute risk index
  const riskScore = Math.min(100, Math.round(adProb * 1.0 + mciProb * 0.5));
  let riskTier = { label: "Low Neurodegenerative Risk", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: ShieldCheck };
  if (riskScore >= 65) {
    riskTier = { label: "High Dementia Risk Indication", color: "text-rose-700 bg-rose-50 border-rose-200", icon: AlertTriangle };
  } else if (riskScore >= 35) {
    riskTier = { label: "Moderate Risk / Transitional Status", color: "text-amber-700 bg-amber-50 border-amber-200", icon: Activity };
  }

  const RiskIcon = riskTier.icon;

  return (
    <div className="space-y-4">
      {/* Risk Index Summary Banner */}
      <div className={`flex items-center justify-between p-3 rounded-lg border text-xs sm:text-sm font-medium ${riskTier.color}`}>
        <div className="flex items-center gap-2">
          <RiskIcon className="w-4 h-4 shrink-0" />
          <span>{riskTier.label}</span>
        </div>
        <span className="font-semibold tabular-nums">Risk Index: {riskScore}/100</span>
      </div>

      {/* Visual Stacked Class Distribution Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-500 font-medium">
          <span>Multiclass Probability Distribution</span>
          <span>100% Normalized</span>
        </div>
        <div className="h-3 w-full rounded-full overflow-hidden flex bg-slate-100">
          <div
            style={{ width: `${adProb}%` }}
            title={`AD: ${adProb.toFixed(1)}%`}
            className="bg-rose-500 transition-all duration-500"
          />
          <div
            style={{ width: `${mciProb}%` }}
            title={`MCI: ${mciProb.toFixed(1)}%`}
            className="bg-amber-500 transition-all duration-500"
          />
          <div
            style={{ width: `${cnProb}%` }}
            title={`CN: ${cnProb.toFixed(1)}%`}
            className="bg-emerald-500 transition-all duration-500"
          />
        </div>
      </div>

      {/* Individual Probability Bars */}
      <div className="space-y-2">
        {["AD", "MCI", "CN"].map((key) => {
          if (probabilities[key] === undefined) return null;
          return (
            <ProbabilityBar
              key={key}
              label={key}
              value={Number(probabilities[key])}
              isDominant={predictedClass === key}
            />
          );
        })}
      </div>
    </div>
  );
}
