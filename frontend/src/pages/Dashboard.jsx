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

  return (
    <DashboardLayout>
      {/* Debug blocks (can remove later) */}
      <div className="bg-red-500 text-white p-4">
        Dashboard is rendering
      </div>

      {loading && (
        <div className="text-gray-400">Loading dashboard...</div>
      )}

      {!loading && data && (
        <>
          <div className="space-y-8">
            <TopMetrics data={data} />
            <ActivityCalendar calendar={data.calendar} />
            <PlatformBreakdown weeklyData={data.weeklyBreakdown} />
          </div>

          {/* Platform hint */}
          {!data.platforms?.github?.connected &&
            !data.platforms?.leetcode?.connected && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 text-sm text-gray-400">
                You haven’t connected any platforms yet.
                You can still use manual tasks and goals, or connect GitHub/LeetCode anytime.
              </div>
            )}

          <div className="grid gap-6 lg:grid-cols-2">
            <ManualTasks tasks={data.recentTasks} />
            <Goals goals={data.goals} />
          </div>
        </>
      )}
    </DashboardLayout>
  );
}
