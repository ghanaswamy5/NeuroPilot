import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModeSelector from "../components/ModeSelector";
import FileUploader from "../components/FileUploader";
import Loader from "../components/Loader";
import usePrediction from "../hooks/usePrediction";
import { Activity, AlertCircle, Sparkles, ArrowRight, ShieldCheck, FileText } from "lucide-react";

export default function Predict() {
  const [mode, setMode] = useState("fusion"); // Default to highest reliability: multimodal fusion
  const [eegFile, setEEGFile] = useState(null);
  const [mriFile, setMRIFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const navigate = useNavigate();
  const {
    loading,
    error,
    predictEEG,
    predictMRI,
    predictFusion,
    saveHistory,
  } = usePrediction();

  // Load a pre-configured sample scenario
  const loadDemoPair = async () => {
    try {
      setErrorMessage(null);
      // Load EEG sample
      const eegRes = await fetch("/samples/eeg_sample_0.npy");
      if (eegRes.ok) {
        const eegBlob = await eegRes.blob();
        setEEGFile(new File([eegBlob], "sample_0.npy", { type: "application/octet-stream" }));
      }
      // Load MRI sample
      const mriRes = await fetch("/samples/mri_sample_cn.jpg");
      if (mriRes.ok) {
        const mriBlob = await mriRes.blob();
        setMRIFile(new File([mriBlob], "mri_sample_cn.jpg", { type: "image/jpeg" }));
      }
    } catch (err) {
      console.error("Demo load error:", err);
      setErrorMessage("Could not load demo samples.");
    }
  };

  const handlePredict = async (e) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    try {
      let result;
      let mriPreviewUrl = null;
      if (mriFile) {
        mriPreviewUrl = URL.createObjectURL(mriFile);
      }

      // ================= EEG =================
      if (mode === "eeg") {
        if (!eegFile) {
          setErrorMessage("Please select or upload a 19-channel EEG (.npy) file.");
          return;
        }

        result = await predictEEG(eegFile);
        await saveHistory({
          prediction_type: "EEG",
          prediction: result.prediction,
          confidence: result.confidence,
        });

        navigate("/results", {
          state: {
            mode: "eeg",
            eeg: result,
            eegFileName: eegFile.name,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      // ================= MRI =================
      if (mode === "mri") {
        if (!mriFile) {
          setErrorMessage("Please select or upload an MRI brain scan image.");
          return;
        }

        result = await predictMRI(mriFile);
        await saveHistory({
          prediction_type: "MRI",
          prediction: result.prediction,
          confidence: result.confidence,
        });

        navigate("/results", {
          state: {
            mode: "mri",
            mri: result,
            mriFileName: mriFile.name,
            mriPreviewUrl: mriPreviewUrl,
            mriFile: mriFile,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }

      // ================= FUSION =================
      if (mode === "fusion") {
        if (!eegFile || !mriFile) {
          setErrorMessage("Multimodal fusion requires both an EEG (.npy) array and an MRI (.jpg/.png) scan.");
          return;
        }

        result = await predictFusion(eegFile, mriFile);
        await saveHistory({
          prediction_type: "Fusion",
          prediction: result.fusion_result.prediction,
          confidence: result.fusion_result.confidence,
        });

        navigate("/results", {
          state: {
            mode: "fusion",
            eeg: result.eeg_result,
            mri: result.mri_result,
            fusion: result.fusion_result,
            eegFileName: eegFile.name,
            mriFileName: mriFile.name,
            mriPreviewUrl: mriPreviewUrl,
            mriFile: mriFile,
            timestamp: new Date().toISOString(),
          },
        });
        return;
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(
        err.message || "Prediction execution failed. Please verify the backend server is running on port 8000."
      );
    }
  };

  const isReady =
    (mode === "eeg" && eegFile) ||
    (mode === "mri" && mriFile) ||
    (mode === "fusion" && eegFile && mriFile);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6">
      {/* Header Banner */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Diagnostic Intake
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-2">
          Run Alzheimer's AI Prediction
        </h1>
        <p className="text-sm sm:text-base text-slate-600 mt-2 max-w-xl mx-auto">
          Choose a single or dual modality. Upload your clinical data or load pre-validated
          OASIS / EEG sample files to evaluate model predictions.
        </p>

        {/* Quick Demo Preload Pill */}
        <div className="mt-4 flex items-center justify-center">
          <button
            type="button"
            onClick={loadDemoPair}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 px-3 py-1.5 rounded-full border border-slate-200 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Click to load validated sample files (EEG + MRI)</span>
          </button>
        </div>
      </div>

      {/* Pipeline Selector */}
      <ModeSelector mode={mode} setMode={setMode} />

      {/* Error Banner */}
      {(errorMessage || error) && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold">Diagnostic Error</h4>
            <p className="mt-0.5 text-xs text-rose-700">{errorMessage || error}</p>
          </div>
        </div>
      )}

      {/* Upload Form */}
      <div className="space-y-4">
        {(mode === "eeg" || mode === "fusion") && (
          <FileUploader
            label="Upload 19-Channel EEG Signal Array (.npy)"
            accept=".npy"
            fileType="eeg"
            file={eegFile}
            setFile={setEEGFile}
            samplePath="/samples/eeg_sample_0.npy"
            sampleName="eeg_sample_0.npy"
          />
        )}

        {(mode === "mri" || mode === "fusion") && (
          <FileUploader
            label="Upload T1 Structural MRI Scan (.jpg, .jpeg, .png)"
            accept=".jpg,.jpeg,.png"
            fileType="mri"
            file={mriFile}
            setFile={setMRIFile}
            samplePath="/samples/mri_sample_cn.jpg"
            sampleName="mri_sample_cn.jpg"
          />
        )}
      </div>

      {/* Action Strip */}
      <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-xs text-slate-500 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Local inference session &bull; Auto-saved to SQLite History</span>
        </div>

        {loading ? (
          <div className="w-full sm:w-auto">
            <Loader message="Running Neural Model Inference..." />
          </div>
        ) : (
          <button
            type="button"
            onClick={handlePredict}
            disabled={!isReady}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm transition shadow-md cursor-pointer ${
              isReady
                ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Generate Diagnosis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
