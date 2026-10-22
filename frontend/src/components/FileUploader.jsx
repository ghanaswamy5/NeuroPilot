import React from "react";
import UploadCard from "./UploadCard";

export default function FileUploader({
  label,
  accept,
  file,
  setFile,
  fileType = "mri",
  samplePath,
  sampleName,
}) {
  const inferredType = fileType || (accept?.includes(".npy") ? "eeg" : "mri");

  return (
    <div className="mb-4">
      <UploadCard
        title={label}
        accept={accept}
        fileType={inferredType}
        file={file}
        setFile={setFile}
        samplePath={samplePath}
        sampleName={sampleName}
      />
    </div>
  );
}
