import React from "react";
import {
  Brain,
  Activity,
  GitMerge,
  Eye,
  ShieldCheck,
  Cpu,
  Layers,
  Database,
  CheckCircle2,
} from "lucide-react";

export default function About() {
  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Title Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Scientific Rationale & Architecture
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 mt-3 tracking-tight">
          About NeuroPilot
        </h1>
        <p className="mt-4 text-base text-slate-600 leading-relaxed">
          NeuroPilot is a clinical AI decision-support platform designed for the early detection and
          multimodal classification of Alzheimer's Disease (AD) and Mild Cognitive Impairment (MCI)
          by fusing electrophysiological signals with structural neuroimaging.
        </p>
      </div>

      {/* Clinical Motivation Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">The Clinical Challenge</h2>
            <p className="text-xs text-slate-500">Early Intervention in Prodromal Dementia</p>
          </div>
        </div>

        <p className="text-sm text-slate-700 leading-relaxed mb-6">
          Alzheimer’s disease begins up to two decades before overt clinical dementia emerges. The transitional
          phase—<strong>Mild Cognitive Impairment (MCI)</strong>—represents the vital therapeutic window where
          lifestyle, pharmacological, and anti-amyloid treatments have maximum efficacy. However, single-modality
          screening frequently suffers from either poor spatial localization (in pure EEG) or delayed structural
          manifestation (in early-stage MRI where macroscopic atrophy has yet to crystallize).
        </p>

        {/* 3 Clinical States Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/50">
            <span className="font-bold text-emerald-800 text-sm block mb-1">
              CN &bull; Cognitively Normal
            </span>
            <p className="text-emerald-700 leading-relaxed">
              Healthy age-matched baseline. Preserved hippocampal volume, symmetrical lateral ventricles,
              and dominant posterior alpha rhythms (8–12 Hz).
            </p>
          </div>

          <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
            <span className="font-bold text-amber-800 text-sm block mb-1">
              MCI &bull; Mild Cognitive Impairment
            </span>
            <p className="text-amber-700 leading-relaxed">
              Measurable synaptic slowing and micro-structural volume shifts. EEG displays theta band
              accentuation; subtle medial temporal lobe atrophy begins.
            </p>
          </div>

          <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/50">
            <span className="font-bold text-rose-800 text-sm block mb-1">
              AD &bull; Alzheimer's Disease
            </span>
            <p className="text-rose-700 leading-relaxed">
              Definitive neurodegeneration. Severe hippocampal volume reduction, enlarged ventricular CSF
              spaces, and widespread EEG spectral slowing (delta/theta dominance).
            </p>
          </div>
        </div>
      </div>

      {/* Model Architectures Deep Dive */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* EEG Architecture */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">EEG Transformer Pipeline</h3>
                <p className="text-xs text-slate-500">19-Channel Electrophysiological Modeling</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              Electroencephalography measures instantaneous postsynaptic potentials. NeuroPilot records
              19 standard international 10-20 channels (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-cyan-700">Fp1, Fp2, F3, F4, C3, C4, P3, P4, O1, O2...</code>).
              Input tensors of shape <code className="font-mono text-slate-800">(1, 19, 500)</code> represent 2.0-second epochs sampled at 250 Hz.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li>Captures cross-electrode coherence and temporal attention weights.</li>
              <li>Quantifies shift from high-frequency beta (13–30 Hz) to slow theta (4–7 Hz).</li>
              <li>High temporal sensitivity detects neurochemical fluctuations before visible atrophy.</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Input: (1, 19, 500)</span>
            <span>Checkpoints: checkpoints/eeg_model.pth</span>
          </div>
        </div>

        {/* MRI Architecture */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Structural MRI Deep CNN</h3>
                <p className="text-xs text-slate-500">Convolutional Morphometry on OASIS Scans</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              The structural vision pipeline takes normalized T1-weighted axial brain slices scaled to <code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-blue-700">224 × 224</code> pixels.
              A multi-stage 2D convolutional network extracts hierarchical representations from low-level tissue boundaries to high-level anatomical substructures.
            </p>

            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li><code className="font-mono">Conv2D(1, 16, k=3)</code> + ReLU + MaxPool2D(2)</li>
              <li><code className="font-mono">Conv2D(16, 32, k=3)</code> + ReLU + MaxPool2D(2)</li>
              <li>Linear classifier layer with softmax multiclass triage: AD, MCI, CN.</li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-mono">
            <span>Input: (1, 1, 224, 224)</span>
            <span>Checkpoints: checkpoints/mri_model.pth</span>
          </div>
        </div>
      </div>

      {/* Multimodal Late Fusion Formula Section */}
      <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-md mb-12">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center">
            <GitMerge className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Weighted Multimodal Late Fusion</h3>
            <p className="text-xs text-blue-300">Ensemble Optimization: 40% EEG + 60% MRI</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
          Rather than naively concatenating raw inputs (early fusion), NeuroPilot performs decision-level
          weighted late fusion on the calibrated softmax probability distributions:
        </p>

        <div className="p-4 bg-slate-950/80 rounded-xl border border-slate-800 text-center font-mono text-sm sm:text-base text-cyan-300 mb-6">
          P_fused(c) = 0.40 × P_EEG(c) + 0.60 × P_MRI(c) &emsp; ∀ c ∈ &#123;AD, MCI, CN&#125;
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
            <span className="font-semibold text-white block mb-1">0.40 Weight on EEG</span>
            Provides acute sensitivity to functional brain slowing and transient metabolic shifts.
          </div>
          <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700">
            <span className="font-semibold text-white block mb-1">0.60 Weight on MRI</span>
            Supplies definitive morphological grounding, preventing false positives from fleeting signal artifacts.
          </div>
        </div>
      </div>

      {/* Explainable AI (Grad-CAM) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Explainable AI via Grad-CAM</h3>
            <p className="text-xs text-slate-500">Gradient-Weighted Class Activation Mapping</p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
          Black-box predictions are unacceptable in clinical neurology. NeuroPilot registers forward and backward
          hooks on the final convolutional layer (<code className="font-mono bg-slate-100 px-1 py-0.5 rounded text-purple-700">model.conv[3]</code>).
          The gradients flowing back from the predicted class node are globally pooled to calculate feature importance weights, producing a localized thermal heatmap projected over the original anatomical scan.
        </p>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
          <span className="font-semibold text-slate-900 block mb-1">Anatomical Verification:</span>
          When evaluating Alzheimer's patients, Grad-CAM attention focuses prominently on the temporal lobes,
          parahippocampal gyrus, and widened lateral ventricles—matching empirical post-mortem histopathology.
        </div>
      </div>
    </div>
  );
}
