export default function PlatformLegend() {
  return (
    <div className="flex justify-center gap-4 mt-4 text-xs text-gray-400">
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 bg-blue-500 rounded-sm" />
        GitHub
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 bg-yellow-400 rounded-sm" />
        LeetCode
      </div>
      <div className="flex items-center gap-1">
        <span className="w-3 h-3 bg-purple-500 rounded-sm" />
        Manual
      </div>
    </div>
  );
}
