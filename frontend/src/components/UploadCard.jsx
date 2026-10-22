import React, { useState, useRef, useEffect } from "react";
import { UploadCloud, FileText, Image as ImageIcon, X, CheckCircle, Sparkles } from "lucide-react";

export default function UploadCard({
  title,
  subtitle,
  accept,
  fileType, // 'mri' or 'eeg'
  file,
  setFile,
  samplePath,
  sampleName,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loadingSample, setLoadingSample] = useState(false);
  const inputRef = useRef(null);

  // Generate preview for images
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    if (fileType === "mri" && file.type?.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, fileType]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelected = (selected) => {
    if (!selected) return;
    const ext = selected.name.split(".").pop().toLowerCase();
    if (fileType === "eeg" && ext !== "npy") {
      alert("Invalid format: EEG requires a NumPy .npy array file.");
      return;
    }
    if (fileType === "mri" && !["jpg", "jpeg", "png"].includes(ext)) {
      alert("Invalid format: MRI requires an image (.jpg, .jpeg, .png).");
      return;
    }
    setFile(selected);
  };

  const loadSample = async () => {
    if (!samplePath) return;
    setLoadingSample(true);
    try {
      const res = await fetch(samplePath);
      if (!res.ok) throw new Error("Could not fetch sample");
      const blob = await res.blob();
      const filename = sampleName || samplePath.split("/").pop();
      const sampleFile = new File([blob], filename, { type: blob.type || "application/octet-stream" });
      setFile(sampleFile);
    } catch (err) {
      console.error("Failed to load sample:", err);
      alert("Sample file is currently unavailable.");
    } finally {
      setLoadingSample(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs transition hover:border-slate-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{title}</h4>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
        {samplePath && !file && (
          <button
            type="button"
            onClick={loadSample}
            disabled={loadingSample}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-md transition cursor-pointer border border-blue-200"
          >
            <Sparkles className="w-3 h-3 text-blue-600" />
            <span>{loadingSample ? "Loading..." : "Load Demo Sample"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => handleFileSelected(e.target.files[0])}
        className="hidden"
      />

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[160px] ${
            isDragging
              ? "border-blue-500 bg-blue-50/60"
              : "border-slate-200 hover:border-blue-400 hover:bg-slate-50/70"
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
            <UploadCloud className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-slate-800">
            Click to upload or drag & drop
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {accept} (Max 50MB)
          </p>
        </div>
      ) : (
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/60 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="MRI Preview"
                className="w-14 h-14 object-cover rounded-lg border border-slate-200 shrink-0 bg-black"
              />
            ) : (
              <div className="w-14 h-14 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                {fileType === "mri" ? (
                  <ImageIcon className="w-7 h-7" />
                ) : (
                  <FileText className="w-7 h-7" />
                )}
              </div>
            )}

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>File Ready</span>
              </div>
              <p className="text-sm font-medium text-slate-900 truncate max-w-[220px] sm:max-w-[340px]">
                {file.name}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {formatFileSize(file.size)} &bull; {fileType.toUpperCase()} Input
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs text-blue-600 hover:underline px-2 py-1 cursor-pointer font-medium"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => setFile(null)}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Remove file"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
