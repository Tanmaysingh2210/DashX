import { useState } from "react";

export default function PlatformBars({ data }) {
  const [hovered, setHovered] = useState(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-40 flex items-center justify-center text-gray-500 text-sm">
        No platform activity yet
      </div>
    );
  }

  return (
    <div className="flex items-end gap-3 h-40">
      {data.map(day => {
        const total = day.github + day.leetcode + day.manual || 1;

        const ghHeight = (day.github / total) * 100;
        const lcHeight = (day.leetcode / total) * 100;
        const mHeight = (day.manual / total) * 100;

        return (
          <div
            key={day.date}
            className="relative flex-1 flex flex-col justify-end"
            onMouseEnter={() => setHovered(day)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="bg-purple-500 rounded-t" style={{ height: `${mHeight}%` }} />
            <div className="bg-yellow-400" style={{ height: `${lcHeight}%` }} />
            <div className="bg-blue-500 rounded-b" style={{ height: `${ghHeight}%` }} />

            {hovered?.date === day.date && (
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 z-50
                bg-black border border-gray-700 text-xs rounded-lg p-2 shadow-xl">
                <div className="font-semibold mb-1">{day.date}</div>
                <div className="text-blue-400">GitHub: {day.github}</div>
                <div className="text-yellow-400">LeetCode: {day.leetcode}</div>
                <div className="text-purple-400">Manual: {day.manual}</div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
