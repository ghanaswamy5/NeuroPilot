import React, { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import ResultCard from "../components/ResultCard";
import ProbabilityChart from "../components/ProbabilityChart";
import DiagnosisBadge from "../components/DiagnosisBadge";
import HeatmapViewer from "../components/HeatmapViewer";
import EEGViewer from "../components/EEGViewer";
import { explainMRI } from "../services/explainApi";
import {
  FileText,
  Activity,
  Brain,
  GitMerge,
  ArrowLeft,
  Clock,
  Sparkles,
  Layers,
  Printer,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";

export default function Results() {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Explainability state
  const [heatmapUrl, setHeatmapUrl] = useState(null);
  const [loadingHeatmap, setLoadingHeatmap] = useState(false);
  const [showEEGViewer, setShowEEGViewer] = useState(false);
  const [heatmapError, setHeatmapError] = useState(null);

  if (!state || (!state.eeg && !state.mri && !state.fusion)) {
    return (
      <div className="max-w-2xl mx-auto py-24 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <Activity className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Active Diagnosis Session Found</h2>
        <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
          Please upload your EEG or MRI scan on the Predict page to generate an AI evaluation.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link
            to="/predict"
            className="inline-flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl text-sm shadow-sm hover:bg-blue-500 transition"
          >
            <span>Start Prediction</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
          <Link
            to="/history"
            className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-medium px-5 py-2.5 rounded-xl text-sm hover:bg-slate-200 transition"
          >
            <Clock className="w-4 h-4" />
            <span>View Past History</span>
          </Link>
        </div>
      </div>
    );
  }

  // Determine primary consensus
  const primaryResult = state.fusion || state.mri || state.eeg;
  const primaryModality = state.fusion
    ? "Multimodal Late Fusion (EEG + MRI)"
    : state.mri
    ? "Structural MRI Neural Model"
    : "19-Channel EEG Transformer";

  const handleGenerateGradCAM = async () => {
    if (!state.mriFile) {
      alert("No MRI image file available in this session to compute Grad-CAM.");
      return;
    }
    setLoadingHeatmap(true);
    setHeatmapError(null);
    try {
      const url = await explainMRI(state.mriFile);
      setHeatmapUrl(url);
    } catch (err) {
      console.error("Grad-CAM generation error:", err);
      setHeatmapError("Failed to generate Grad-CAM heatmap. Ensure backend is running.");
    } finally {
      setLoadingHeatmap(false);
    }
  };

  const goToReport = () => {
    navigate("/report", {
      state: {
        ...state,
        primaryResult,
        heatmapUrl,
      },
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 sm:px-6">
      {/* Top Breadcrumb & Action Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <Link
          to="/predict"
          className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-500 hover:text-slate-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Predict</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goToReport}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Generate Clinical Report</span>
          </button>
        </div>
      </div>

      {/* Primary Diagnosis Headline Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-700/80 mb-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-700/80">
          <div>
            <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Primary Diagnostic Consensus &bull; {primaryModality}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Classification: {primaryResult.prediction}
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Evaluated with a decision confidence of{" "}
              <span className="font-bold text-white tabular-nums">
                {Number(primaryResult.confidence).toFixed(2)}%
              </span>
            </p>
          </div>

          <DiagnosisBadge diagnosis={primaryResult.prediction} size="lg" />
        </div>

        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-1">Assessed Modalities</span>
            <span className="font-semibold text-slate-200">
              {state.fusion ? "EEG + MRI (Dual Stream)" : state.mri ? "Structural MRI (T1)" : "19-Ch EEG Array"}
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-1">Session ID / Timestamp</span>
            <span className="font-mono text-slate-300">
              {new Date(state.timestamp || Date.now()).toLocaleString()}
            </span>
          </div>

          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
            <span className="text-slate-400 block mb-1">Audit Trail</span>
            <span className="font-semibold text-emerald-400 flex items-center gap-1">
              <span>Saved in Local SQLite Log</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Results: Fusion, MRI, and EEG Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Weighted Fusion Card (if available) */}
        {state.fusion && (
          <div className="lg:col-span-2">
            <ResultCard
              title="Multimodal Weighted Late Fusion (Consensus)"
              prediction={state.fusion.prediction}
              confidence={state.fusion.confidence}
              modality="fusion"
            >
              <p className="text-xs text-slate-600 mb-4">
                Ensemble formula: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-blue-700 font-semibold">P_fused = 0.40 × P_EEG + 0.60 × P_MRI</code>. By uniting functional micro-states with anatomical neuroimaging, the multimodal prediction achieves greater robustness against motion artifacts and focal scan variances.
              </p>
              <ProbabilityChart
                probabilities={state.fusion.probabilities}
                predictedClass={state.fusion.prediction}
              />
            </ResultCard>
          </div>
        )}

        {/* Structural MRI Card */}
        {state.mri && (
          <ResultCard
            title="Structural MRI Scan Analysis"
            prediction={state.mri.prediction}
            confidence={state.mri.confidence}
            modality="mri"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Deep CNN (Conv2D &bull; OASIS Slices)</span>
              {state.mriFileName && <span className="font-mono truncate max-w-[180px]">{state.mriFileName}</span>}
            </div>
            <ProbabilityChart
              probabilities={state.mri.probabilities}
              predictedClass={state.mri.prediction}
            />

            {/* Grad-CAM Trigger */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Explainability Analysis:</span>
              <button
                type="button"
                onClick={handleGenerateGradCAM}
                disabled={loadingHeatmap}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 transition cursor-pointer border border-blue-200"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>{loadingHeatmap ? "Generating Grad-CAM..." : "Compute Grad-CAM Heatmap"}</span>
              </button>
            </div>
          </ResultCard>
        )}

        {/* EEG Analysis Card */}
        {state.eeg && (
          <ResultCard
            title="19-Channel EEG Signal Analysis"
            prediction={state.eeg.prediction}
            confidence={state.eeg.confidence}
            modality="eeg"
          >
            <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
              <span>Transformer Temporal Attention</span>
              {state.eegFileName && <span className="font-mono truncate max-w-[180px]">{state.eegFileName}</span>}
            </div>
            <ProbabilityChart
              probabilities={state.eeg.probabilities}
              predictedClass={state.eeg.prediction}
            />

            {/* Waveform Viewer Toggle */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-600 font-medium">Signal Inspection:</span>
              <button
                type="button"
                onClick={() => setShowEEGViewer(!showEEGViewer)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 transition cursor-pointer border border-cyan-200"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
                <span>{showEEGViewer ? "Hide EEG Waves" : "Inspect 10-20 Waveforms"}</span>
              </button>
            </div>
          </ResultCard>
        )}
      </div>

      {/* Dynamic EEG Waveform Section */}
      {showEEGViewer && (
        <div className="mb-10">
          <EEGViewer file={state.eegFile} />
        </div>
      )}

      {/* Dynamic Grad-CAM Heatmap Section */}
      {(heatmapUrl || loadingHeatmap || heatmapError) && (
        <div className="mb-10">
          {heatmapError && (
            <div className="p-4 bg-rose-50 text-rose-800 rounded-xl text-xs mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>{heatmapError}</span>
            </div>
          )}
          <HeatmapViewer
            originalImage={state.mriPreviewUrl}
            heatmapImage={heatmapUrl}
            prediction={state.mri?.prediction || primaryResult.prediction}
          />
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="font-semibold text-slate-900 text-sm">Finished Reviewing Results?</h4>
          <p className="text-xs text-slate-500 mt-0.5">
            You can print the certified diagnostic summary report or evaluate new scans.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={goToReport}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Open Clinical Report</span>
          </button>

          <Link
            to="/predict"
            className="inline-flex items-center gap-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition"
          >
            <span>Scan Another Patient</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
