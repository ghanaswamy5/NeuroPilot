import React, { useState } from "react";
import { explainMRI } from "../services/explainApi";
import UploadCard from "../components/UploadCard";
import HeatmapViewer from "../components/HeatmapViewer";
import Loader from "../components/Loader";
import { Brain, FileSearch, Sparkles, Layers, Info, AlertCircle, ArrowRight } from "lucide-react";

export default function Explain() {
  const [file, setFile] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(null);
  const [heatmapUrl, setHeatmapUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // When a file is selected, create local preview
  const handleFileChange = (selected) => {
    setFile(selected);
    setError(null);
    setHeatmapUrl(null);
    if (selected) {
      const url = URL.createObjectURL(selected);
      setOriginalImageUrl(url);
    } else {
      setOriginalImageUrl(null);
    }
  };

  const handleExplain = async () => {
    if (!file) {
      setError("Please select or upload a structural MRI brain scan (.jpg, .jpeg, .png).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const imgUrl = await explainMRI(file);
      setHeatmapUrl(imgUrl);
    } catch (err) {
      console.error(err);
      setError("Failed to generate Grad-CAM heatmap. Ensure the backend FastAPI server is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Explainable AI (XAI)
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
          MRI Grad-CAM Visual Attention
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Unmask deep learning decisions. Gradient-weighted Class Activation Mapping (Grad-CAM)
          identifies the precise brain voxels and anatomical regions influencing Alzheimer's triage.
        </p>
      </div>

      {/* Upload & Sample Preloads */}
      <div className="mb-8">
        <UploadCard
          title="Select Structural MRI Scan"
          subtitle="T1-weighted axial or coronal brain slice (.jpg, .jpeg, .png)"
          accept=".jpg,.jpeg,.png"
          fileType="mri"
          file={file}
          setFile={handleFileChange}
          samplePath="/samples/mri_sample_cn.jpg"
          sampleName="mri_sample_cn.jpg"
        />

        {error && (
          <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>Probes ConvLayer 3 gradients to map discriminative neuroimaging features.</span>
          </div>

          <button
            type="button"
            onClick={handleExplain}
            disabled={!file || loading}
            className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition shadow-sm cursor-pointer ${
              file && !loading
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{loading ? "Generating Heatmap..." : "Generate Grad-CAM Overlay"}</span>
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="my-10 p-8 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <Loader message="Computing Gradient Backpropagation on Convolutional Features..." />
        </div>
      )}

      {/* Heatmap Viewer Display */}
      {heatmapUrl && !loading && (
        <div className="my-10">
          <HeatmapViewer
            originalImage={originalImageUrl}
            heatmapImage={heatmapUrl}
          />
        </div>
      )}

      {/* Scientific Background Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-slate-200 text-xs text-slate-600">
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="font-semibold text-slate-900 text-sm mb-1">Medial Temporal Lobes</div>
          <p className="leading-relaxed">
            The earliest site of tau neurofibrillary tangles. Grad-CAM frequently registers intense activation
            in the entorhinal cortex and hippocampus in progressive AD stages.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="font-semibold text-slate-900 text-sm mb-1">Ventricular Expansion</div>
          <p className="leading-relaxed">
            Hydrocephalus ex vacuo creates pronounced CSF boundary contrasts around the lateral ventricles,
            which the model's high-frequency kernels readily prioritize.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div className="font-semibold text-slate-900 text-sm mb-1">Mathematical Formulation</div>
          <p className="leading-relaxed">
            Calculates weights <code className="bg-slate-200 px-1 py-0.5 rounded text-blue-700">w_k = (1/Z) Σ (∂y^c / ∂A^k)</code> followed by a rectified linear activation unit to preserve solely positive discriminative features.
          </p>
        </div>
      </div>
    </div>
  );
}
