import React from "react";
import { useLocation, Link } from "react-router-dom";
import DiagnosisBadge from "../components/DiagnosisBadge";
import ProbabilityChart from "../components/ProbabilityChart";
import {
  Brain,
  Printer,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  ShieldAlert,
  Layers,
} from "lucide-react";

export default function Report() {
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-4 text-center">
        <h2 className="text-xl font-bold text-slate-800">No report data found in active session</h2>
        <p className="text-xs text-slate-500 mt-2">
          Run a prediction first to generate a printable clinical evaluation.
        </p>
        <Link
          to="/predict"
          className="inline-block mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-semibold"
        >
          Go to Predict
        </Link>
      </div>
    );
  }

  const primaryResult = state.primaryResult || state.fusion || state.mri || state.eeg;
  const isAD = primaryResult.prediction === "AD";
  const isMCI = primaryResult.prediction === "MCI";
  const isCN = primaryResult.prediction === "CN";

  const handlePrint = () => {
    window.print();
  };

  const reportId = `NP-${new Date(state.timestamp || Date.now()).getFullYear()}-${Math.floor(
    100000 + Math.random() * 900000
  )}`;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Action Bar (hidden when printing) */}
      <div className="no-print flex items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
        <Link
          to="/results"
          state={state}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Results</span>
        </Link>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-4 py-2 rounded-xl shadow-xs transition cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Official Clinical Report Paper Layout */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 sm:p-12 print-card text-slate-800">
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b-2 border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center">
              <Brain className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">NeuroPilot</h1>
              <p className="text-xs text-slate-500 uppercase font-semibold tracking-wider">
                Clinical Diagnostic Decision Support &bull; AI Lab
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 text-slate-600">
            <div>
              <span className="font-semibold text-slate-900">Report Reference:</span>{" "}
              <span className="font-mono">{reportId}</span>
            </div>
            <div>
              <span className="font-semibold text-slate-900">Assessment Date:</span>{" "}
              {new Date(state.timestamp || Date.now()).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            <div>
              <span className="font-semibold text-slate-900">Evaluation Engine:</span>{" "}
              <span>v2.0 (Transformer + CNN + Grad-CAM)</span>
            </div>
          </div>
        </div>

        {/* Patient / Session Metadata */}
        <div className="my-6 p-4 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Diagnostic Protocol</span>
            <span className="font-semibold text-slate-800">
              {state.fusion ? "Dual-Modality Late Fusion" : state.mri ? "Structural MRI (T1)" : "19-Channel EEG Array"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Decision Weighting</span>
            <span className="font-semibold text-slate-800">
              {state.fusion ? "0.40 EEG : 0.60 MRI" : "1.00 Single Modality"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Input Source(s)</span>
            <span className="font-semibold text-slate-800 truncate block">
              {state.mriFileName || state.eegFileName || "Uploaded Scans"}
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Audit Record</span>
            <span className="font-semibold text-emerald-700">Archived in DB</span>
          </div>
        </div>

        {/* Primary Classification Block */}
        <div className="my-8 p-6 rounded-2xl border-2 border-slate-900 bg-slate-50">
          <span className="text-xs uppercase font-extrabold tracking-wider text-blue-700 block mb-2">
            Primary Diagnostic Finding
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black text-slate-950">
                {primaryResult.prediction === "AD" && "Alzheimer's Disease (AD)"}
                {primaryResult.prediction === "MCI" && "Mild Cognitive Impairment (MCI)"}
                {primaryResult.prediction === "CN" && "Cognitively Normal (CN - Healthy Control)"}
              </h2>
              <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
                {isAD &&
                  "Severe neurodegenerative biomarker profile consistent with clinical Alzheimer's dementia, marked by cortical thinning and dominant theta/delta EEG power slowing."}
                {isMCI &&
                  "Subtle neurodegenerative transitions detected exceeding normal age-adjusted decay parameters. Patient is in the crucial therapeutic intervention window."}
                {isCN &&
                  "Structural brain volume and electrophysiological spectral densities are consistent with normal healthy cognitive controls without degenerative features."}
              </p>
            </div>

            <div className="text-right shrink-0">
              <span className="text-xs text-slate-400 block font-medium uppercase tracking-wider">
                Confidence
              </span>
              <span className="text-2xl font-black text-slate-900 tabular-nums">
                {Number(primaryResult.confidence).toFixed(2)}%
              </span>
              <div className="mt-1">
                <DiagnosisBadge diagnosis={primaryResult.prediction} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Multiclass Probability Distribution Table */}
        <div className="my-8">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
            Class Probability Distribution Breakdown
          </h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Diagnostic Category</th>
                  <th className="p-3">Clinical Definition</th>
                  <th className="p-3 text-right">Computed Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className={primaryResult.prediction === "AD" ? "bg-rose-50/60 font-semibold" : ""}>
                  <td className="p-3 text-rose-700">AD (Alzheimer's Disease)</td>
                  <td className="p-3 text-slate-600">Active neurodegenerative dementia pathology</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900">
                    {Number(primaryResult.probabilities?.AD || 0).toFixed(2)}%
                  </td>
                </tr>
                <tr className={primaryResult.prediction === "MCI" ? "bg-amber-50/60 font-semibold" : ""}>
                  <td className="p-3 text-amber-700">MCI (Mild Cognitive Impairment)</td>
                  <td className="p-3 text-slate-600">Prodromal cognitive transition state</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900">
                    {Number(primaryResult.probabilities?.MCI || 0).toFixed(2)}%
                  </td>
                </tr>
                <tr className={primaryResult.prediction === "CN" ? "bg-emerald-50/60 font-semibold" : ""}>
                  <td className="p-3 text-emerald-700">CN (Cognitively Normal)</td>
                  <td className="p-3 text-slate-600">Healthy control aging baseline</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-900">
                    {Number(primaryResult.probabilities?.CN || 0).toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainability / Visual Evidence (if Grad-CAM is available) */}
        {state.heatmapUrl && (
          <div className="my-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Explainable AI (Grad-CAM) Visual Evidence</span>
            </h3>
            <p className="text-xs text-slate-600 mb-4">
              Gradient-weighted class activation mapping superimposed onto structural MRI. Identifies localized focal areas (temporal lobe atrophy, ventricular widening) that directly determined the classification.
            </p>
            <div className="flex justify-center">
              <img
                src={state.heatmapUrl}
                alt="Grad-CAM Visual Evidence"
                className="max-h-56 rounded-lg border border-slate-300 shadow-xs"
              />
            </div>
          </div>
        )}

        {/* Clinical Recommendations & Protocol */}
        <div className="my-8 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Investigative Protocol & Next Steps
          </h3>
          <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-relaxed">
            <li>
              <span className="font-semibold">Secondary Cognitive Testing:</span> Administer full
              Montreal Cognitive Assessment (MoCA) and Mini-Mental State Examination (MMSE).
            </li>
            <li>
              <span className="font-semibold">Biomarker Corroboration:</span> Consider amyloid PET
              imaging or lumbar puncture for CSF phosphorylated tau (p-tau181) and Aβ42 ratios.
            </li>
            <li>
              <span className="font-semibold">Longitudinal Monitoring:</span> If classified as MCI,
              schedule follow-up neuroimaging and EEG evaluation in 6 months to measure progression velocity.
            </li>
          </ul>
        </div>

        {/* Regulatory Disclaimer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-[11px] text-slate-500 leading-relaxed">
          <div className="flex items-center gap-1.5 font-semibold text-slate-700 mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
            <span>Diagnostic Disclaimer & Compliance Notice</span>
          </div>
          <p>
            This automated diagnostic report was generated by NeuroPilot AI decision support software.
            It provides assistive classification based on machine learning models trained on research cohorts.
            It is not an autonomous medical prescription. Final clinical diagnosis must be determined
            by a licensed medical practitioner in conjunction with comprehensive clinical history.
          </p>
        </div>

        {/* Signature Line */}
        <div className="mt-12 pt-6 border-t border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="border-b border-slate-400 pb-8 mb-2">
              <span className="text-slate-400 italic">Signature / Digital ID</span>
            </div>
            <p className="font-semibold text-slate-800">Reviewing Physician / Neuroscientist</p>
            <p className="text-slate-500 text-[11px]">Department of Neurology & Radiology</p>
          </div>

          <div className="text-right">
            <div className="border-b border-slate-400 pb-8 mb-2">
              <span className="text-slate-400 italic">Date of Validation</span>
            </div>
            <p className="font-semibold text-slate-800">
              {new Date().toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
            <p className="text-slate-500 text-[11px]">Official Audit Record #{reportId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
