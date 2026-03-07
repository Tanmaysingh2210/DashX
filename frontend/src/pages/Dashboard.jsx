import { useEffect, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DashboardContext } from "../context/DashboardContext";
import TopMetrics from "../components/dashboard/TopMetrics";
import ActivityCalendar from "../components/dashboard/ActivityCalendar";
import PlatformBreakdown from "../components/dashboard/PlatformBreakdown";
import ManualTasks from "../components/dashboard/ManualTasks";
import Goals from "../components/dashboard/Goals";

export default function Dashboard() {
  const { data, loading, fetchDashboard } = useContext(DashboardContext);

  useEffect(() => {
    fetchDashboard();
  }, []);

  // Derive weekly platform breakdown from calendar data (last 7 days)
  const weeklyData = data?.calendar
    ? data.calendar.slice(0, 7).map(day => ({
        date: day.date,
        github: day.github?.commits ?? 0,
        leetcode: day.leetcode?.problemsSolved ?? 0,
        manual: day.manual?.score ?? 0,
      }))
    : [];

  return (
    <DashboardLayout>
      {loading && (
        <div className="text-gray-400">Loading dashboard...</div>
      )}

      {!loading && data && (
        <>
          <div className="space-y-8">
            <TopMetrics data={data} />
            <ActivityCalendar calendar={data.calendar} />
            <PlatformBreakdown weeklyData={weeklyData} />
          </div>

          {/* Platform hint */}
          {!data.platforms?.github?.connected &&
            !data.platforms?.leetcode?.connected && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-400 mt-6">
                You haven't connected any platforms yet.
                You can still use manual tasks and goals, or connect GitHub/LeetCode anytime.
              </div>
            )}

          <div className="grid gap-6 lg:grid-cols-2 mt-6">
            <ManualTasks tasks={data.recentTasks} />
            <Goals goals={data.goals} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
