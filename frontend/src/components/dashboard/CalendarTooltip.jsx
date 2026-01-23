export default function CalendarTooltip({ day, filter }) {
  const { date, score, github, leetcode, manual } = day;

  return (
    <div
      className="
        absolute z-50 mt-2 p-3 text-xs rounded-lg
        bg-black border border-gray-700 shadow-xl
      "
      style={{ top: "-100%", left: "0" }}
    >
      <div className="font-semibold mb-1">{date}</div>

      {filter === "ALL" && (
        <>
          <div>GitHub: {github}</div>
          <div>LeetCode: {leetcode}</div>
          <div>Manual: {manual}</div>
        </>
      )}

      {filter === "GITHUB" && <div>GitHub commits: {github}</div>}
      {filter === "LEETCODE" && <div>Problems solved: {leetcode}</div>}
      {filter === "MANUAL" && <div>Manual score: {manual}</div>}

      <div className="mt-1 text-gray-400">
        Total score: {score}
      </div>
    </div>
  );
}
