import api from "./api";

/**
 * Generate Grad-CAM explainability heatmap for an MRI scan.
 * @param {File|Blob} file The MRI image file
 * @returns {Promise<string>} Blob Object URL of the heatmap image
 */
export const explainMRI = async (file) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post("/explain/mri", form, {
    responseType: "blob",
  });

  return URL.createObjectURL(res.data);
};
