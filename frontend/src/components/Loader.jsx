import React, { useState, useEffect } from "react";
import { Brain, Cpu, CheckCircle2 } from "lucide-react";

export default function Loader({ message = "Running AI Prediction..." }) {
  const [stage, setStage] = useState(0);

  const stages = [
    "Preprocessing signal & image tensors...",
    "Extracting deep neural representations...",
    "Computing multiclass softmax distribution...",
    "Synthesizing diagnostic confidence..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStage((prev) => (prev + 1) % stages.length);
    }, 900);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      {/* Animated Medical Scanner Graphic */}
      <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
        {/* Pulsing rings */}
        <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-ping opacity-30" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-inner">
          <Brain className="w-7 h-7 animate-pulse" />
        </div>
      </div>

      <h3 className="text-base font-semibold text-slate-900 mb-1">{message}</h3>
      <p className="text-xs text-blue-600 font-medium h-5 transition-all">
        {stages[stage]}
      </p>

      {/* Progress pill dots */}
      <div className="flex items-center gap-1.5 mt-4">
        {stages.map((_, i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === stage ? "w-6 bg-blue-600" : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
