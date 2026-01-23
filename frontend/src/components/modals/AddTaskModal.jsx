import { useState } from "react";

export default function AddTaskModal() {
  const [open, setOpen] = useState(false);

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

            <input
              placeholder="Task name (e.g. System Design reading)"
              className="w-full mb-3 p-2 bg-gray-900 border border-gray-700 rounded"
            />

            <input
              placeholder="Weight (default 0.5)"
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
