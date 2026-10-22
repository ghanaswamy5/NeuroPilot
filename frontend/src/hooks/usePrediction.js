import { useState } from "react";
import api from "../services/api";

export default function usePrediction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const predictEEG = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/predict/eeg", form);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "EEG prediction failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const predictMRI = async (file) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await api.post("/predict/mri", form);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "MRI prediction failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const predictFusion = async (eegFile, mriFile) => {
    setLoading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("eeg_file", eegFile);
      form.append("mri_file", mriFile);
      const res = await api.post("/predict/fusion", form);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.detail || err.message || "Multimodal fusion failed";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const saveHistory = async (data) => {
    try {
      const res = await api.post("/history", data);
      return res.data;
    } catch (err) {
      console.warn("Could not record prediction in history:", err);
      return null;
    }
  };

  const getHistory = async () => {
    const res = await api.get("/history");
    return res.data;
  };

  const deleteHistory = async (id) => {
    const res = await api.delete(`/history/${id}`);
    return res.data;
  };

  return {
    loading,
    error,
    setError,
    predictEEG,
    predictMRI,
    predictFusion,
    saveHistory,
    getHistory,
    deleteHistory,
  };
}
