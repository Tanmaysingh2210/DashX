import { useMemo, useState } from "react";
import "./Heatmap.css";

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Returns the color intensity bucket (0-4) for a given count,
 * using the max count in the dataset to scale thresholds.
 */
const getLevel = (count, max) => {
  if (count === 0) return 0;
  if (max <= 4) return Math.min(count, 4); // small datasets — 1:1 mapping
  const ratio = count / max;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
};

/**
 * Builds a 53-week x 7-day grid ending today, filling in any
 * missing dates with zero counts so the grid is always complete.
 */
const buildWeeks = (days) => {
  const map = new Map(days.map((d) => [d.date, d]));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // start on the Sunday that begins the week 52 weeks ago
  const start = new Date(today);
  start.setDate(start.getDate() - 52 * 7);
  start.setDate(start.getDate() - start.getDay()); // back up to Sunday

  const weeks = [];
  let current = new Date(start);

  while (current <= today) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = current.toISOString().split("T")[0];
      const entry = map.get(dateStr);
      week.push({
        date: dateStr,
        githubCount: entry?.githubCount || 0,
        leetcodeCount: entry?.leetcodeCount || 0,
        totalCount: entry?.totalCount || 0,
        month: current.getMonth(),
        isFuture: current > today,
      });
      current.setDate(current.getDate() + 1);
    }
    weeks.push(week);
  }

  return weeks;
};

/**
 * Heatmap
 *
 * @param {Array<{ date, githubCount, leetcodeCount, totalCount }>} days
 */
const Heatmap = ({ days = [] }) => {
  const [hovered, setHovered] = useState(null);

  const weeks = useMemo(() => buildWeeks(days), [days]);

  const maxCount = useMemo(
    () => days.reduce((max, d) => Math.max(max, d.totalCount), 1),
    [days]
  );

  // figure out which weeks should show a month label (first week containing day 1-7 of a new month)
  const monthMarkers = useMemo(() => {
    const markers = [];
    let lastMonth = -1;
    weeks.forEach((week, i) => {
      const firstDay = week[0];
      if (firstDay.month !== lastMonth) {
        markers.push({ weekIndex: i, label: MONTH_LABELS[firstDay.month] });
        lastMonth = firstDay.month;
      }
    });
    return markers;
  }, [weeks]);

  return (
    <div className="heatmap">
      <div className="heatmap__scroll">
        <div className="heatmap__months">
          {weeks.map((_, i) => {
            const marker = monthMarkers.find((m) => m.weekIndex === i);
            return (
              <div key={i} className="heatmap__month-cell">
                {marker?.label || ""}
              </div>
            );
          })}
        </div>

        <div className="heatmap__body">
          <div className="heatmap__days">
            {DAY_LABELS.map((label, i) => (
              <div key={label} className="heatmap__day-label">
                {i % 2 === 1 ? label : ""}
              </div>
            ))}
          </div>

          <div className="heatmap__grid">
            {weeks.map((week, wi) => (
              <div className="heatmap__week" key={wi} style={{ animationDelay: `${Math.min(wi * 6, 300)}ms` }}>
                {week.map((day) => {
                  const level = getLevel(day.totalCount, maxCount);
                  return (
                    <div
                      key={day.date}
                      className={`heatmap__cell heatmap__cell--lvl${level} ${
                        day.isFuture ? "heatmap__cell--future" : ""
                      }`}
                      style={{ animationDelay: `${Math.min(wi * 6, 300)}ms` }}
                      onMouseEnter={() => setHovered(day)}
                      onMouseLeave={() => setHovered(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="heatmap__footer">
        <div className="heatmap__tooltip" aria-live="polite">
          {hovered ? (
            <>
              <span className="heatmap__tooltip-date">
                {new Date(hovered.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="heatmap__tooltip-detail">
                <span className="dot dot--github" /> {hovered.githubCount} commits
              </span>
              <span className="heatmap__tooltip-detail">
                <span className="dot dot--leetcode" /> {hovered.leetcodeCount} solved
              </span>
            </>
          ) : (
            <span className="heatmap__tooltip-hint">Hover a day to see details</span>
          )}
        </div>

        <div className="heatmap__legend">
          <span>Less</span>
          {[0, 1, 2, 3, 4].map((lvl) => (
            <span key={lvl} className={`heatmap__legend-swatch heatmap__cell--lvl${lvl}`} />
          ))}
          <span>More</span>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;