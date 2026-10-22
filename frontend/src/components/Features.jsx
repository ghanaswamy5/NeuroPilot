import React from "react";
import { Activity, Brain, GitMerge, Layers, Cpu, Eye } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: Activity,
      title: "19-Channel EEG Signal Analysis",
      subtitle: "Electrophysiological Biomarkers",
      description:
        "Utilizes a deep Transformer-based architecture to capture temporal frequency anomalies across Delta (0.5–4Hz), Theta (4–7Hz), Alpha (8–12Hz), and Beta (13–30Hz) bands associated with early synaptic dysfunction.",
      badge: "Transformer Model",
      color: "text-cyan-600 bg-cyan-50 border-cyan-200",
      specs: ["10-20 Standard Montage", "250 Hz Sampling", "500 Time-points"],
    },
    {
      icon: Brain,
      title: "Structural MRI Scan Analysis",
      subtitle: "Morphometric Brain Imaging",
      description:
        "A customized convolutional neural network trained on normalized T1-weighted axial scans to detect cortical atrophy, ventricular enlargement, and medial temporal lobe volume reduction.",
      badge: "CNN Architecture",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      specs: ["224x224 Normalized Slices", "Multi-stage Pooling", "OASIS Dataset"],
    },
    {
      icon: GitMerge,
      title: "Weighted Late Fusion (40:60)",
      subtitle: "Multimodal Ensemble Decision",
      description:
        "Combines the individual softmax probability vectors using an optimal late-fusion weighting (40% EEG + 60% MRI), significantly reducing false-positive rates and maximizing early MCI sensitivity.",
      badge: "Multimodal Fusion",
      color: "text-indigo-600 bg-indigo-50 border-indigo-200",
      specs: ["P_fused = 0.4*P_EEG + 0.6*P_MRI", "Cross-entropy Calibrated", "Dual Triage"],
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
            System Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Integrated Deep Learning Pipeline
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            Single-modality screening can miss early biomarkers. NeuroPilot unifies functional
            electrophysiology with structural neuroimaging for dependable diagnostic predictions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs hover:shadow-md hover:border-slate-300 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${feature.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-xs font-semibold text-blue-600 mt-1">{feature.subtitle}</p>

                  <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Specifications
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {feature.specs.map((spec, i) => (
                      <span
                        key={i}
                        className="text-[11px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200 font-mono"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
