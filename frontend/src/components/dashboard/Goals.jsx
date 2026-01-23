import AddGoalModal from "../modals/AddGoalModal";

export default function Goals({ goals }) {
  if (!goals || goals.length === 0) {
    return (
      <div className="bg-card border border-gray-800 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Goals</h3>
          <AddGoalModal />
        </div>

        <div className="text-sm text-gray-500">
          No goals created yet
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Goals</h3>
        <AddGoalModal />
      </div>

      <div className="space-y-4">
        {goals.map(goal => {
          const percent = Math.min(
            Math.round((goal.currentValue / goal.targetValue) * 100),
            100
          );

          return (
            <div
              key={goal._id}
              className="bg-gray-900 p-4 rounded-lg"
            >
              <div className="flex justify-between text-sm mb-1">
                <span>{goal.title}</span>
                <span className="text-gray-400">
                  {goal.currentValue}/{goal.targetValue}
                </span>
              </div>

              <div className="w-full bg-gray-800 h-2 rounded-full">
                <div
                  className="bg-accent h-2 rounded-full transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
