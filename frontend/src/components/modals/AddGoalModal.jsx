import { useState } from "react";

export default function AddGoalModal() {
  const [open, setOpen] = useState(false);

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

            <input
              placeholder="Goal title (e.g. Weekly score)"
              className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
            />

            <select className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded">
              <option>Weighted Score</option>
              <option>Streak</option>
              <option>GitHub commits</option>
              <option>LeetCode problems</option>
            </select>

            <input
              placeholder="Target value"
              className="w-full mb-4 p-2 bg-gray-900 border border-gray-700 rounded"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="text-sm text-gray-400"
              >
                Cancel
              </button>
              <button className="text-sm bg-accent text-black px-3 py-1 rounded">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
