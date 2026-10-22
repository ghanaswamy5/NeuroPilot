import axios from "axios";

// API client connected to local FastAPI backend
const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  timeout: 30000,
});

// Check if backend server is responsive
export const checkHealth = async () => {
  try {
    const res = await api.get("/health", { timeout: 3000 });
    return res.data?.status === "Healthy";
  } catch {
    return false;
  }
};

export default api;
