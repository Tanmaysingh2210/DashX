import MetricCard from "./MetricCard";

export default function TopMetrics({ data }) {
  const { streaks, today, weekly } = data;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* Combined Streak */}
      <MetricCard
        title="Combined Streak"
        value={`${streaks.combined} 🔥`}
        subtitle="Days of consistency"
      />

      {/* Today Score */}
      <MetricCard
        title="Today’s Score"
        value={today.weightedScore}
        subtitle="Weighted productivity"
      >
        <div className="flex text-xs text-gray-400 gap-3">
          <span>GH: {today.github}</span>
          <span>LC: {today.leetcode}</span>
          <span>Manual: {today.manual}</span>
        </div>
      </MetricCard>

      {/* Weekly Progress */}
      <MetricCard
        title="Weekly Progress"
        value={`${weekly.percentage}%`}
        subtitle={`${weekly.totalScore} / ${weekly.target}`}
      >
        <div className="w-full bg-gray-800 rounded-full h-2 mt-2">
          <div
            className="bg-accent h-2 rounded-full transition-all"
            style={{ width: `${weekly.percentage}%` }}
          />
        </div>
      </MetricCard>

      {/* Platform Streaks */}
      <MetricCard
        title="Platform Streaks"
        value={`${streaks.github + streaks.leetcode}`}
        subtitle="Active days"
      >
        <div className="flex justify-between text-xs text-gray-400 mt-2">
          <span>GitHub: {streaks.github}</span>
          <span>LeetCode: {streaks.leetcode}</span>
        </div>
      </MetricCard>

    </div>
  );
}
