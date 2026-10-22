import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import DiagnosisBadge from "../components/DiagnosisBadge";
import Loader from "../components/Loader";
import {
  Clock,
  Trash2,
  Download,
  Filter,
  Search,
  Activity,
  Brain,
  GitMerge,
  AlertCircle,
  FileSpreadsheet,
  Plus,
  RefreshCw,
} from "lucide-react";

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/history");
      setHistory(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setError("Unable to connect to history database. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this audit record?")) return;

    setDeletingId(id);
    try {
      await api.delete(`/history/${id}`);
      setHistory((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete record.");
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Filtered and searched records
  const filtered = history.filter((item) => {
    const matchesType =
      filterType === "all" ||
      item.prediction_type?.toLowerCase() === filterType.toLowerCase();

    const matchesSearch =
      !searchQuery ||
      item.prediction?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.prediction_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      new Date(item.timestamp).toLocaleString().toLowerCase().includes(searchQuery.toLowerCase());

    return matchesType && matchesSearch;
  });

  // Summary Metrics
  const totalScans = history.length;
  const adCount = history.filter((h) => h.prediction === "AD").length;
  const mciCount = history.filter((h) => h.prediction === "MCI").length;
  const cnCount = history.filter((h) => h.prediction === "CN").length;

  // Export CSV
  const exportCSV = () => {
    if (history.length === 0) return;
    const headers = ["ID,Prediction_Type,Prediction,Confidence,Timestamp\n"];
    const rows = history.map(
      (h) =>
        `${h.id},"${h.prediction_type}","${h.prediction}",${h.confidence},"${h.timestamp}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `neuropilot_history_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Database Audit Log
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-2">
            Prediction History & Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Persisted record of local model inferences stored in SQLite (<code className="font-mono">neuropilot.db</code>).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={fetchHistory}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            title="Refresh history"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          {history.length > 0 && (
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Export CSV</span>
            </button>
          )}

          <Link
            to="/predict"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Prediction</span>
          </Link>
        </div>
      </div>

      {/* Aggregate Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">Total Evaluated Scans</span>
          <span className="text-2xl font-bold text-slate-900 mt-1 block tabular-nums">
            {totalScans}
          </span>
        </div>

        <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-200 shadow-xs">
          <span className="text-xs text-rose-700 font-medium block">AD Positive (Alzheimer's)</span>
          <span className="text-2xl font-bold text-rose-900 mt-1 block tabular-nums">
            {adCount}
          </span>
        </div>

        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 shadow-xs">
          <span className="text-xs text-amber-700 font-medium block">MCI Prodromal (Impaired)</span>
          <span className="text-2xl font-bold text-amber-900 mt-1 block tabular-nums">
            {mciCount}
          </span>
        </div>

        <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 shadow-xs">
          <span className="text-xs text-emerald-700 font-medium block">CN Baseline (Normal)</span>
          <span className="text-2xl font-bold text-emerald-900 mt-1 block tabular-nums">
            {cnCount}
          </span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3 text-rose-800 text-xs">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-rose-900">Database Connection Failed</h4>
            <p className="mt-0.5 text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Modality Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {[
            { id: "all", label: "All Modalities" },
            { id: "fusion", label: "Fusion" },
            { id: "mri", label: "MRI" },
            { id: "eeg", label: "EEG" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search prediction or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-blue-600 bg-slate-50 focus:bg-white"
          />
        </div>
      </div>

      {/* History Table */}
      {loading ? (
        <div className="py-12 bg-white rounded-xl border border-slate-200">
          <Loader message="Querying SQLite Audit Database..." />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-xl border border-slate-200">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="font-semibold text-slate-800 text-base">No Matching Records Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {history.length === 0
              ? "You haven't run any predictions yet. Run your first scan to populate the audit log."
              : "No prediction records match your active search filter."}
          </p>
          {history.length === 0 && (
            <Link
              to="/predict"
              className="inline-block mt-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold px-4 py-2 rounded-lg"
            >
              Start First Prediction
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 text-slate-600 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="p-4">Record ID</th>
                  <th className="p-4">Modality Stream</th>
                  <th className="p-4">Primary Diagnosis</th>
                  <th className="p-4">Model Confidence</th>
                  <th className="p-4">Timestamp</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((item) => {
                  const type = item.prediction_type?.toLowerCase() || "";
                  const TypeIcon =
                    type.includes("fusion")
                      ? GitMerge
                      : type.includes("mri")
                      ? Brain
                      : Activity;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="p-4 font-mono font-medium text-slate-500">
                        #{item.id}
                      </td>

                      <td className="p-4">
                        <span className="inline-flex items-center gap-1.5 font-semibold text-slate-800">
                          <TypeIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>{item.prediction_type}</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <DiagnosisBadge diagnosis={item.prediction} size="sm" />
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-[140px]">
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className="bg-blue-600 h-1.5 rounded-full"
                              style={{ width: `${Math.min(100, item.confidence || 0)}%` }}
                            />
                          </div>
                          <span className="font-semibold text-slate-800 tabular-nums">
                            {Number(item.confidence).toFixed(1)}%
                          </span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-500">
                        {item.timestamp ? new Date(item.timestamp).toLocaleString() : "Recorded"}
                      </td>

                      <td className="p-4 text-right">
                        <button
                          type="button"
                          onClick={() => deleteHistory(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete record from database"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>Showing {filtered.length} of {history.length} records</span>
            <span>SQLite Database: neuropilot.db</span>
          </div>
        </div>
      )}
    </div>
  );
}
