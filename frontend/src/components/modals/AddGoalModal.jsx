import { useState, useContext } from "react";
import api from "../../api/axios";
import { DashboardContext } from "../../context/DashboardContext";

const METRIC_OPTIONS = [
  { label: "Weighted Score", value: "WEIGHTED_SCORE" },
  { label: "Streak",         value: "STREAK" },
  { label: "GitHub Commits", value: "GITHUB_COMMITS" },
  { label: "LeetCode Problems", value: "LEETCODE_PROBLEMS" },
];

export default function AddGoalModal() {
  const { fetchDashboard } = useContext(DashboardContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [metric, setMetric] = useState("WEIGHTED_SCORE");
  const [targetValue, setTargetValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setError("");

    if (!title.trim()) {
      return setError("Goal title is required");
    }

    const parsed = parseFloat(targetValue);
    if (!targetValue || isNaN(parsed) || parsed <= 0) {
      return setError("Target value must be a positive number");
    }

    setLoading(true);
    try {
      await api.post("/goals", {
        title: title.trim(),
        metric,
        targetValue: parsed
      });
      setTitle("");
      setMetric("WEIGHTED_SCORE");
      setTargetValue("");
      setOpen(false);
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1 rounded border border-gray-700"
      >
        + Add Goal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card w-full max-w-md rounded-xl p-6">
            <h4 className="font-semibold mb-4">Add Goal</h4>

            {error && (
              <div className="text-sm text-red-400 mb-3">{error}</div>
            )}

            <input
              placeholder="Goal title (e.g. Weekly score)"
              className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <select
              className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
              value={metric}
              onChange={e => setMetric(e.target.value)}
            >
              {METRIC_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>

            <input
              placeholder="Target value (e.g. 100)"
              type="number"
              min="1"
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
              value={targetValue}
              onChange={e => setTargetValue(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setOpen(false); setError(""); }}
                className="text-sm text-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={loading}
                className="text-sm bg-accent text-black px-3 py-1 rounded disabled:opacity-50"
              >
                {loading ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
