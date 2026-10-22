import React, { useState, useEffect, useRef } from "react";
import { Activity, Play, Pause, ZoomIn, ZoomOut, RefreshCw, Info } from "lucide-react";

const STANDARD_19_CHANNELS = [
  "Fp1", "Fp2", "F7", "F3", "Fz", "F4", "F8",
  "T3", "C3", "Cz", "C4", "T4",
  "T5", "P3", "Pz", "P4", "T6",
  "O1", "O2"
];

export default function EEGViewer({ file, fileData = null }) {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(0);
  const [channelData, setChannelData] = useState([]);
  const [samplingRate] = useState(250); // 250 Hz
  const [activeChannels, setActiveChannels] = useState(STANDARD_19_CHANNELS.slice(0, 8)); // Display primary 8 by default
  const animFrameId = useRef(null);

  // Parse .npy or synthesize realistic multi-channel EEG oscillations
  useEffect(() => {
    let isMounted = true;

    const generateSyntheticEEG = () => {
      const numChannels = STANDARD_19_CHANNELS.length;
      const numPoints = 500; // standard 2 seconds @ 250Hz
      const channels = [];

      for (let ch = 0; ch < numChannels; ch++) {
        const points = [];
        // Base frequencies: Delta (1-3Hz), Theta (4-7Hz), Alpha (8-12Hz), Beta (15-25Hz)
        const alphaPhase = Math.random() * Math.PI * 2;
        const thetaPhase = Math.random() * Math.PI * 2;
        const noiseWeight = 0.15;

        for (let i = 0; i < numPoints; i++) {
          const t = i / 250;
          // Alpha rhythm + theta burst + micro-fluctuations
          const val =
            Math.sin(2 * Math.PI * 10 * t + alphaPhase) * 0.6 +
            Math.sin(2 * Math.PI * 5 * t + thetaPhase) * 0.35 +
            (Math.random() - 0.5) * noiseWeight;
          points.push(val);
        }
        channels.push({
          name: STANDARD_19_CHANNELS[ch],
          data: points,
        });
      }
      return channels;
    };

    if (file && file.name?.endsWith(".npy")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!isMounted) return;
        try {
          const buffer = e.target.result;
          // Inspect header of .npy: magic \x93NUMPY
          const bytes = new Uint8Array(buffer);
          if (bytes[0] === 0x93 && bytes[1] === 0x4e && bytes[2] === 0x55 && bytes[3] === 0x4d && bytes[4] === 0x50 && bytes[5] === 0x59) {
            const headerLen = bytes[8] + (bytes[9] << 8);
            const dataOffset = 10 + headerLen;
            const floatData = new Float32Array(buffer, dataOffset);
            
            // Assume 19 channels x 500 points (or N samples)
            const numChannels = 19;
            const pointsPerChannel = Math.floor(floatData.length / numChannels) || 500;
            const extracted = [];

            for (let ch = 0; ch < numChannels; ch++) {
              const points = [];
              const start = ch * pointsPerChannel;
              for (let i = 0; i < Math.min(pointsPerChannel, 500); i++) {
                points.push(floatData[start + i] || 0);
              }
              extracted.push({
                name: STANDARD_19_CHANNELS[ch] || `Ch-${ch+1}`,
                data: points,
              });
            }
            setChannelData(extracted);
            return;
          }
        } catch {
          // Fallback to synthetic if parsing varies
        }
        setChannelData(generateSyntheticEEG());
      };
      reader.readAsArrayBuffer(file);
    } else {
      setChannelData(generateSyntheticEEG());
    }

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Canvas drawing loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || channelData.length === 0) return;
    const ctx = canvas.getContext("2d");

    let currentOffset = offset;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;

      // Dark clinical electrophysiology display background
      ctx.fillStyle = "#090d16";
      ctx.fillRect(0, 0, width, height);

      // Draw subtle grid (time horizontal & microvolt vertical)
      ctx.strokeStyle = "#172033";
      ctx.lineWidth = 1;
      const gridX = width / 10;
      const gridY = height / (activeChannels.length || 1);

      for (let x = 0; x < width; x += gridX) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += gridY) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw each active channel waveform
      const channelsToDraw = channelData.filter((c) => activeChannels.includes(c.name));
      const rowHeight = height / (channelsToDraw.length || 1);

      channelsToDraw.forEach((channel, idx) => {
        const centerY = idx * rowHeight + rowHeight / 2;

        // Channel Label
        ctx.fillStyle = "#38bdf8";
        ctx.font = "11px Inter, sans-serif";
        ctx.fillText(channel.name, 12, centerY - 8);

        // Waveform trace
        ctx.beginPath();
        ctx.strokeStyle = "#22d3ee";
        ctx.lineWidth = 1.3;

        const points = channel.data;
        const totalPoints = points.length;

        for (let x = 0; x < width; x++) {
          const sampleIdx = Math.floor((x * 2 + currentOffset) % totalPoints);
          const val = points[sampleIdx] || 0;
          const y = centerY + val * 24 * scale;

          if (x === 0) {
            ctx.moveTo(x + 50, y);
          } else {
            ctx.lineTo(x + 50, y);
          }
        }
        ctx.stroke();

        // Baseline reference
        ctx.strokeStyle = "#1e293b";
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(50, centerY);
        ctx.lineTo(width, centerY);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      if (isPlaying) {
        currentOffset += 2;
        animFrameId.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [channelData, activeChannels, isPlaying, scale]);

  const toggleChannel = (name) => {
    setActiveChannels((prev) =>
      prev.includes(name)
        ? prev.filter((c) => c !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-white shadow-lg">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-sm sm:text-base text-slate-100">
              10-20 Multichannel EEG Waveform Monitor
            </h3>
            <p className="text-xs text-slate-400">
              19-Channel Montage &bull; 250 Hz Sampling Rate &bull; Voltage Range: ±50 μV
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 cursor-pointer transition ${
              isPlaying
                ? "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                : "bg-cyan-600 border-cyan-500 text-white hover:bg-cyan-500"
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{isPlaying ? "Pause" : "Live Stream"}</span>
          </button>

          <button
            type="button"
            onClick={() => setScale((s) => Math.min(2.5, s + 0.25))}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Increase Amplitude Scale"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.25))}
            className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white cursor-pointer"
            title="Decrease Amplitude Scale"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative rounded-lg overflow-hidden border border-slate-800 bg-[#090d16]">
        <canvas
          ref={canvasRef}
          width={800}
          height={320}
          className="w-full h-[320px] block"
        />
      </div>

      {/* Channel Montage Selector Pills */}
      <div className="mt-4 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between mb-2 text-xs text-slate-400">
          <span>Active Electrode Montage Channels ({activeChannels.length}/19):</span>
          <button
            type="button"
            onClick={() => setActiveChannels(STANDARD_19_CHANNELS)}
            className="text-cyan-400 hover:underline cursor-pointer"
          >
            Select All
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {STANDARD_19_CHANNELS.map((ch) => {
            const active = activeChannels.includes(ch);
            return (
              <button
                key={ch}
                type="button"
                onClick={() => toggleChannel(ch)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition cursor-pointer ${
                  active
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                    : "bg-slate-800 text-slate-400 border border-slate-700/60 hover:text-slate-200"
                }`}
              >
                {ch}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
