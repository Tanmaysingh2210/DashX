import AddTaskModal from "../modals/AddTaskModal";

export default function ManualTasks({ tasks }) {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Manual Tasks</h3>
        <AddTaskModal />
      </div>

      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-sm text-gray-500">
            No manual tasks yet
          </div>
        )}

        {tasks.map(task => (
          <div
            key={task._id}
            className="flex items-center justify-between p-3 bg-gray-900 rounded-lg"
          >
            <div>
              <div className="text-sm font-medium">
                {task.title}
              </div>
              <div className="text-xs text-gray-500">
                Weight: {task.weight}
              </div>
            </div>

            <button className="text-xs text-accent hover:underline">
              Mark done
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
