import React, { useState } from "react";
import { Sliders, Download, Eye, Layers, Brain, CheckCircle, Info } from "lucide-react";

export default function HeatmapViewer({ originalImage, heatmapImage, prediction = null }) {
  const [opacity, setOpacity] = useState(0.7);
  const [viewMode, setViewMode] = useState("overlay"); // 'overlay' or 'sideBySide'

  const downloadHeatmap = () => {
    if (!heatmapImage) return;
    const link = document.createElement("a");
    link.href = heatmapImage;
    link.download = "neuropilot_gradcam_heatmap.png";
    link.click();
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 text-sm sm:text-base">
              Grad-CAM Visual Attention Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Convolutional activation mapping on structural MRI (ConvLayer 3)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="bg-slate-100 p-0.5 rounded-lg flex text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode("overlay")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === "overlay"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Blended</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("sideBySide")}
              className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
                viewMode === "sideBySide"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Side-by-Side</span>
            </button>
          </div>

          {heatmapImage && (
            <button
              type="button"
              onClick={downloadHeatmap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Image Display */}
      {viewMode === "overlay" ? (
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-[420px] aspect-square rounded-xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
            {originalImage ? (
              <img
                src={originalImage}
                alt="Original MRI"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="text-slate-500 text-xs">No scan uploaded</div>
            )}

            {heatmapImage && (
              <img
                src={heatmapImage}
                alt="Grad-CAM Overlay"
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 pointer-events-none"
                style={{ opacity: opacity }}
              />
            )}
          </div>

          {/* Opacity Slider */}
          {heatmapImage && (
            <div className="w-full max-w-[420px] mt-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex justify-between items-center text-xs text-slate-700 font-medium mb-1.5">
                <span className="flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-slate-500" />
                  Heatmap Blend Intensity:
                </span>
                <span className="font-semibold tabular-nums">{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>0% (Raw MRI Scan)</span>
                <span>100% (Full Heatmap Focus)</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Side by Side Mode */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-600 mb-1.5">Raw Structural MRI</span>
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
              {originalImage ? (
                <img
                  src={originalImage}
                  alt="Original MRI"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-500 text-xs">No scan uploaded</div>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <span className="text-xs font-semibold text-slate-600 mb-1.5">Grad-CAM Activation Overlay</span>
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-slate-200 bg-black flex items-center justify-center">
              {heatmapImage ? (
                <img
                  src={heatmapImage}
                  alt="Grad-CAM"
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="text-slate-500 text-xs">Heatmap not yet generated</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Clinical Interpretation Guide */}
      <div className="mt-5 p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-blue-900">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-blue-950">How to interpret Grad-CAM in Alzheimer's:</p>
            <p className="text-blue-800 leading-relaxed">
              Warm regions (red / yellow) denote anatomical regions that drove the model's classification decision. In Alzheimer's pathology, attention typically localizes to the medial temporal lobes, hippocampal atrophy zones, and enlarged lateral ventricles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
