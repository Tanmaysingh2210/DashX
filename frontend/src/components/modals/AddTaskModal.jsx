import { useState, useContext } from "react";
import api from "../../api/axios";
import { DashboardContext } from "../../context/DashboardContext";

export default function AddTaskModal() {
  const { fetchDashboard } = useContext(DashboardContext);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    setError("");

    if (!title.trim()) {
      return setError("Task name is required");
    }

    const parsedWeight = parseFloat(weight);
    if (weight !== "" && (isNaN(parsedWeight) || parsedWeight < 0)) {
      return setError("Weight must be a positive number");
    }

    setLoading(true);
    try {
      await api.post("/tasks", {
        title: title.trim(),
        weight: weight !== "" ? parsedWeight : 1
      });
      setTitle("");
      setWeight("");
      setOpen(false);
      await fetchDashboard();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-3 py-1 rounded bg-accent text-black"
      >
        + Add Task
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-card w-full max-w-md rounded-xl p-6">
            <h4 className="font-semibold mb-4">Add Manual Task</h4>

            {error && (
              <div className="text-sm text-red-400 mb-3">{error}</div>
            )}

            <input
              placeholder="Task name (e.g. System Design reading)"
              className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />

            <input
              placeholder="Weight (default 1)"
              type="number"
              min="0"
              step="0.5"
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
              value={weight}
              onChange={e => setWeight(e.target.value)}
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
