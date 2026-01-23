import PlatformLegend from "./PlatformLegend";
import PlatformBars from "./PlatformBars";

export default function PlatformBreakdown({ weeklyData }) {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-5">
      <h3 className="font-semibold mb-4">Platform Contribution</h3>

      <PlatformBars data={weeklyData} />

      <PlatformLegend />
    </div>
  );
}
