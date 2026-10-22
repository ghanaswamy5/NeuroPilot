import React from "react";
import { ShieldCheck, Zap, Eye, Database, CheckCircle2 } from "lucide-react";

export default function WhyChoose() {
  const points = [
    {
      icon: ShieldCheck,
      title: "Functional & Structural Redundancy",
      description:
        "EEG captures immediate synaptic activity deficits while MRI reveals physical tissue shrinkage. Evaluating both dramatically decreases misclassification risks.",
    },
    {
      icon: Zap,
      title: "Early MCI Stage Sensitivity",
      description:
        "Mild Cognitive Impairment is the pivotal intervention window. The dual-model ensemble is calibrated to distinguish MCI from healthy aging controls.",
    },
    {
      icon: Eye,
      title: "Interpretable Grad-CAM Attention",
      description:
        "Clinicians never receive black-box predictions. Heatmaps explicitly highlight which brain voxels (hippocampus, ventricles, cortex) governed the decision.",
    },
    {
      icon: Database,
      title: "Full Audit History & Offline Privacy",
      description:
        "Runs entirely locally with dedicated SQLite audit logging. Patient data is processed on-premise without unencrypted third-party cloud transfers.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100/60 px-3 py-1 rounded-full border border-blue-200">
            Clinical Rationale
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Why Multi-Modal NeuroPilot?
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Engineered to overcome the blind spots of single-modality Alzheimer's assessment tools.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {points.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4 hover:border-blue-200 transition"
              >
                <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base mb-1">{pt.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {pt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
