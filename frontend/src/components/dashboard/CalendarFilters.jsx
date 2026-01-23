import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";

const filters = ["ALL", "GITHUB", "LEETCODE", "MANUAL"];

export default function CalendarFilters() {
  const { filter, setFilter } = useContext(CalendarContext);

  return (
    <div className="flex gap-2 text-xs">
      {filters.map(f => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`px-3 py-1 rounded-full border transition
            ${
              filter === f
                ? "bg-accent text-black border-accent"
                : "border-gray-700 text-gray-400 hover:bg-gray-800"
            }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
