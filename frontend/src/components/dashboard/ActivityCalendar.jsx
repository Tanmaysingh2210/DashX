import { useContext } from "react";
import { CalendarContext } from "../../context/CalendarContext";
import CalendarFilters from "./CalendarFilters";
import CalendarGrid from "./CalendarGrid";

export default function ActivityCalendar({ calendar }) {
  return (
    <div className="bg-card border border-gray-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activity</h3>
        <CalendarFilters />
      </div>

      <CalendarGrid calendar={calendar} />
    </div>
  );
}
