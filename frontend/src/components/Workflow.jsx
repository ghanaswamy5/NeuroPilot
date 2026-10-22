import React from "react";
import { UploadCloud, Filter, Cpu, GitMerge, FileText } from "lucide-react";

export default function Workflow() {
  const steps = [
    {
      num: "01",
      icon: UploadCloud,
      title: "Data Intake",
      desc: "Upload 19-channel EEG (.npy) and/or structural MRI brain scans (.jpg, .png).",
    },
    {
      num: "02",
      icon: Filter,
      title: "Tensor Preprocessing",
      desc: "Automatic bandpass filtering, 224x224 grayscale normalization, and tensor batching.",
    },
    {
      num: "03",
      icon: Cpu,
      title: "Deep Inference",
      desc: "Transformer extracts temporal signal attention while 2D CNN processes cortical morphology.",
    },
    {
      num: "04",
      icon: GitMerge,
      title: "Weighted Fusion & XAI",
      desc: "40:60 late fusion calculation and Grad-CAM attention heatmap projection.",
    },
    {
      num: "05",
      icon: FileText,
      title: "Clinical Report",
      desc: "Instant multiclass diagnosis (AD / MCI / CN), confidence breakdown, and PDF export.",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
            Pipeline Overview
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            How NeuroPilot Processes Scans
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            From raw diagnostic inputs to explainable, multi-perspective clinical classifications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative bg-slate-50 border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:bg-blue-50/30 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {step.num}
                    </span>
                    <Icon className="w-5 h-5 text-slate-500" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-1.5">{step.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
