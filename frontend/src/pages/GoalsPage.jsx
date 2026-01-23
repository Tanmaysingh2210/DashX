import { useEffect, useContext } from "react";
import DashboardLayout from "../layouts/DashboardLayout";
import { DashboardContext } from "../context/DashboardContext";
import Goals from "../components/dashboard/Goals";

export default function GoalsPage() {
  const { data, loading, fetchDashboard } = useContext(DashboardContext);

  useEffect(() => {
    // dashboard summary already contains goals
    fetchDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold">Goals</h1>
          <p className="text-sm text-gray-400 mt-1">
            Track long-term outcomes based on your daily activity
          </p>
        </div>

        {/* Loading state */}
        {loading && (
          <div className="text-gray-400">
            Loading goals...
          </div>
        )}

        {/* Loaded state */}
        {!loading && data && (
          <Goals goals={data.goals} />
        )}
      </div>
    </DashboardLayout>
  );
}
