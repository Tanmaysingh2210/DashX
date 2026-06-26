// import { useEffect, useMemo } from "react";
// import { useAuth } from "../context/AuthContext";
// import { useActivity } from "../context/ActivityContext";
// import Heatmap from "../components/Heatmap";
// import StatCard from "../components/StatCard";
// import Loader from "../components/Loader";
// import {
//   FlameIcon,
//   GitHubIcon,
//   LeetCodeIcon,
//   TrendIcon,
//   RefreshIcon,
//   CommitIcon,
//   ClockIcon,
// } from "../components/Icons";
// import "./Dashboard.css";

// const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// const formatRelative = (dateStr) => {
//   if (!dateStr) return "Never";
//   const date = new Date(dateStr);
//   const diffMs = Date.now() - date.getTime();
//   const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
//   if (diffHrs < 1) return "Just now";
//   if (diffHrs < 24) return `${diffHrs}h ago`;
//   const diffDays = Math.floor(diffHrs / 24);
//   return `${diffDays}d ago`;
// };

// const Dashboard = () => {
//   const { user } = useAuth();
//   const { days, stats, loading, syncing, error, loadAll, sync } = useActivity();

//   useEffect(() => {
//     loadAll();
//   }, [loadAll]);

//   // ── derived insights computed client-side from the raw days array ──
//   const insights = useMemo(() => {
//     if (!days.length) return null;

//     const githubTotal = days.reduce((s, d) => s + d.githubCount, 0);
//     const leetcodeTotal = days.reduce((s, d) => s + d.leetcodeCount, 0);

//     // most active weekday
//     const weekdayTotals = new Array(7).fill(0);
//     const monthTotals = {};
//     days.forEach((d) => {
//       const date = new Date(d.date);
//       weekdayTotals[date.getDay()] += d.totalCount;
//       const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
//       monthTotals[monthKey] = (monthTotals[monthKey] || 0) + d.totalCount;
//     });

//     const mostActiveDay = DAY_NAMES[weekdayTotals.indexOf(Math.max(...weekdayTotals))];

//     let peakMonth = "—";
//     let peakValue = -1;
//     Object.entries(monthTotals).forEach(([key, value]) => {
//       if (value > peakValue) {
//         peakValue = value;
//         const [, month] = key.split("-");
//         peakMonth = MONTH_NAMES[Number(month)];
//       }
//     });

//     const activeDays = days.filter((d) => d.totalCount > 0);
//     const avgPerActiveDay = activeDays.length
//       ? (activeDays.reduce((s, d) => s + d.totalCount, 0) / activeDays.length).toFixed(1)
//       : "0";

//     // last active date per platform
//     const lastGithub = [...days].reverse().find((d) => d.githubCount > 0);
//     const lastLeetcode = [...days].reverse().find((d) => d.leetcodeCount > 0);

//     // last 7 days totals
//     const last7 = days.slice(-7);
//     const githubWeekly = last7.reduce((s, d) => s + d.githubCount, 0);
//     const leetcodeWeekly = last7.reduce((s, d) => s + d.leetcodeCount, 0);

//     // consistency — % of last 30 days active
//     const last30 = days.slice(-30);
//     const activeIn30 = last30.filter((d) => d.totalCount > 0).length;
//     const consistency = last30.length ? Math.round((activeIn30 / last30.length) * 100) : 0;

//     return {
//       githubTotal,
//       leetcodeTotal,
//       mostActiveDay,
//       peakMonth,
//       avgPerActiveDay,
//       lastGithub,
//       lastLeetcode,
//       githubWeekly,
//       leetcodeWeekly,
//       consistency,
//     };
//   }, [days]);

//   const handleSync = async () => {
//     await sync();
//   };

//   return (
//     <div className="page dashboard fade-in">
//       <div className="dashboard__header">
//         <div>
//           <h1 className="headline-lg">Welcome back, {user?.githubUsername}</h1>
//           <p className="body-md">
//             Last synced {stats?.lastSynced ? formatRelative(stats.lastSynced) : "never"}
//           </p>
//         </div>
//         <button className="btn btn--secondary" onClick={handleSync} disabled={syncing}>
//           <RefreshIcon className={syncing ? "icon-spin" : ""} />
//           {syncing ? "Syncing..." : "Sync now"}
//         </button>
//       </div>

//       {error && <div className="dashboard__error card">{error}</div>}

//       {loading && !stats ? (
//         <Loader label="Loading your activity..." />
//       ) : (
//         <>
//           <div className="grid dashboard__stats">
//             <StatCard
//               label="Combined current streak"
//               value={stats?.currentStreak ?? 0}
//               unit="days"
//               sub={stats?.longestStreak ? `Best is ${stats.longestStreak} days` : undefined}
//               icon={<FlameIcon />}
//               accent="tertiary"
//               delay={0}
//             />
//             <StatCard
//               label="GitHub contributions"
//               value={insights?.githubTotal ?? 0}
//               sub={insights ? `${insights.githubWeekly} this week` : undefined}
//               icon={<GitHubIcon />}
//               accent="secondary"
//               subTone="success"
//               delay={60}
//             />
//             <StatCard
//               label="LeetCode submissions"
//               value={insights?.leetcodeTotal ?? 0}
//               sub={insights ? `${insights.leetcodeWeekly} this week` : undefined}
//               icon={<LeetCodeIcon />}
//               accent="tertiary"
//               subTone="warning"
//               delay={120}
//             />
//             <StatCard
//               label="Consistency score"
//               value={`${insights?.consistency ?? 0}%`}
//               sub="Active days in last 30"
//               icon={<TrendIcon />}
//               accent="primary"
//               subTone="primary"
//               delay={180}
//             />
//           </div>

//           <div className="card dashboard__heatmap-card fade-up" style={{ animationDelay: "240ms" }}>
//             <div className="dashboard__heatmap-header">
//               <h2 className="title-lg">Unified activity heatmap</h2>
//               <div className="dashboard__heatmap-legend">
//                 <span><span className="dot dot--github" /> GitHub</span>
//                 <span><span className="dot dot--leetcode" /> LeetCode</span>
//                 <span><span className="dot dot--combined" /> Combined</span>
//               </div>
//             </div>

//             <Heatmap days={days} />

//             {insights && (
//               <div className="dashboard__heatmap-stats">
//                 <HeatmapStat icon={<FlameIcon />} label="Best streak" value={`${stats?.longestStreak ?? 0} days`} />
//                 <HeatmapStat icon={<ClockIcon />} label="Most active" value={insights.mostActiveDay} />
//                 <HeatmapStat icon={<TrendIcon />} label="Peak month" value={insights.peakMonth} />
//                 <HeatmapStat icon={<CommitIcon />} label="Daily avg" value={insights.avgPerActiveDay} />
//               </div>
//             )}
//           </div>

//           <div className="dashboard__panels">
//             <ActivityPanel
//               title="GitHub activity"
//               accent="secondary"
//               icon={<GitHubIcon />}
//               rows={[
//                 { label: "Contributions this week", value: insights?.githubWeekly ?? 0 },
//                 { label: "All-time contributions", value: insights?.githubTotal ?? 0 },
//                 { label: "Username", value: `@${user?.githubUsername}`, mono: true },
//               ]}
//               lastActive={insights?.lastGithub?.date}
//               delay={300}
//             />
//             <ActivityPanel
//               title="LeetCode activity"
//               accent="tertiary"
//               icon={<LeetCodeIcon />}
//               rows={[
//                 { label: "Submissions this week", value: insights?.leetcodeWeekly ?? 0 },
//                 { label: "All-time submissions", value: insights?.leetcodeTotal ?? 0 },
//                 { label: "Username", value: `${user?.leetcodeUsername}`, mono: true },
//               ]}
//               lastActive={insights?.lastLeetcode?.date}
//               delay={360}
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// const HeatmapStat = ({ icon, label, value }) => (
//   <div className="heatmap-stat">
//     <div className="heatmap-stat__icon">{icon}</div>
//     <div>
//       <p className="label-md">{label}</p>
//       <p className="title-lg">{value}</p>
//     </div>
//   </div>
// );

// const ActivityPanel = ({ title, icon, accent, rows, lastActive, delay }) => (
//   <div className={`card activity-panel activity-panel--${accent} fade-up`} style={{ animationDelay: `${delay}ms` }}>
//     <div className="activity-panel__header">
//       <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
//       <h3 className="title-lg">{title}</h3>
//     </div>

//     <div className="activity-panel__rows">
//       {rows.map((row) => (
//         <div className="activity-panel__row" key={row.label}>
//           <span className="body-md activity-panel__row-label">{row.label}</span>
//           <span className={row.mono ? "mono" : "title-lg"}>{row.value}</span>
//         </div>
//       ))}
//     </div>

//     <div className="activity-panel__footer">
//       <span className={`dot dot--${accent === "secondary" ? "github" : "leetcode"}`} />
//       <span className="label-md activity-panel__last-active">
//         Last active: {lastActive ? formatRelative(lastActive) : "—"}
//       </span>
//     </div>
//   </div>
// );

// export default Dashboard;







import { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { useActivity } from "../context/ActivityContext";
import Heatmap from "../components/Heatmap";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import {
  FlameIcon,
  GitHubIcon,
  LeetCodeIcon,
  TrendIcon,
  RefreshIcon,
  CommitIcon,
  ClockIcon,
} from "../components/Icons";
import "./Dashboard.css";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const formatRelative = (dateStr) => {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHrs < 1) return "Just now";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  return `${diffDays}d ago`;
};

const Dashboard = () => {
  const { user } = useAuth();
  const { days, stats, loading, syncing, error, loadAll, sync } = useActivity();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── derived insights computed client-side from the raw days array ──
  const insights = useMemo(() => {
    if (!days.length) return null;

    const githubTotal = days.reduce((s, d) => s + d.githubCount, 0);
    const leetcodeTotal = days.reduce((s, d) => s + d.leetcodeCount, 0);

    // ── weekday + month bucketing ──
    // BUG FIX: new Date("YYYY-MM-DD") parses as UTC midnight, but .getDay()/.getMonth()
    // uses LOCAL timezone. In IST (UTC+5:30) a Monday date becomes Sunday night UTC.
    // Fix: parse the date string directly without Date() to avoid timezone shift.
    const weekdayTotals = new Array(7).fill(0);
    const monthTotals = {};

    days.forEach((d) => {
      // parse "YYYY-MM-DD" directly — no Date() constructor, no timezone shift
      const [year, month, day] = d.date.split("-").map(Number);

      // weekday via UTC date — getUTCDay() is timezone-safe
      const utcDate = new Date(Date.UTC(year, month - 1, day));
      const weekday = utcDate.getUTCDay(); // 0=Sun, 1=Mon ... 6=Sat
      weekdayTotals[weekday] += d.totalCount;

      // month key: "2024-7" (month is 0-indexed to match MONTH_NAMES)
      const monthKey = `${year}-${month - 1}`;
      monthTotals[monthKey] = (monthTotals[monthKey] || 0) + d.totalCount;
    });

    const mostActiveDay = DAY_NAMES[weekdayTotals.indexOf(Math.max(...weekdayTotals))];

    // peak month — find the month key with the highest total
    let peakMonth = "—";
    let peakValue = -1;
    Object.entries(monthTotals).forEach(([key, value]) => {
      if (value > peakValue) {
        peakValue = value;
        const [, monthIndex] = key.split("-");
        peakMonth = MONTH_NAMES[Number(monthIndex)]; // monthIndex is already 0-based
      }
    });

    // ── consistency: % of actual last 30 CALENDAR days that had activity ──
    // BUG FIX: `days` only contains active docs (no zeros stored anymore).
    // days.slice(-30) gives last 30 ACTIVE days, not last 30 calendar days.
    // Fix: build a Set of active dates, then check the last 30 calendar days.
    const activeDateSet = new Set(days.map((d) => d.date));

    const today = new Date();
    let activeIn30 = 0;
    for (let i = 0; i < 30; i++) {
      const d = new Date(Date.UTC(
        today.getUTCFullYear(),
        today.getUTCMonth(),
        today.getUTCDate() - i
      ));
      const dateStr = d.toISOString().split("T")[0];
      if (activeDateSet.has(dateStr)) activeIn30++;
    }
    const consistency = Math.round((activeIn30 / 30) * 100);

    // ── active days in last 30 calendar days (same fix) ──
    const activeDaysIn30 = activeIn30; // reuse from above

    // ── daily average: total contributions ÷ 30 calendar days ──
    // BUG FIX: was dividing by activeDays.length (always = days.length since no zeros).
    // "Daily average" should mean per calendar day, not per active day.
    const last30Total = days
      .filter((d) => {
        const cutoff = new Date(Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() - 29
        )).toISOString().split("T")[0];
        return d.date >= cutoff;
      })
      .reduce((s, d) => s + d.totalCount, 0);

    const avgPerDay = (last30Total / 30).toFixed(1);

    // last active date per platform
    const lastGithub = [...days].reverse().find((d) => d.githubCount > 0);
    const lastLeetcode = [...days].reverse().find((d) => d.leetcodeCount > 0);

    // last 7 days totals — use calendar days not slice
    const sevenDaysAgo = new Date(Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate() - 6
    )).toISOString().split("T")[0];

    const last7Days = days.filter((d) => d.date >= sevenDaysAgo);
    const githubWeekly = last7Days.reduce((s, d) => s + d.githubCount, 0);
    const leetcodeWeekly = last7Days.reduce((s, d) => s + d.leetcodeCount, 0);

    return {
      githubTotal,
      leetcodeTotal,
      mostActiveDay,
      peakMonth,
      avgPerDay,
      activeDaysIn30,
      lastGithub,
      lastLeetcode,
      githubWeekly,
      leetcodeWeekly,
      consistency,
    };
  }, [days]);

  const handleSync = async () => {
    await sync();
  };

  return (
    <div className="page dashboard fade-in">
      <div className="dashboard__header">
        <div>
          <h1 className="headline-lg">Welcome back, {user?.githubUsername}</h1>
          <p className="body-md">
            Last synced {stats?.lastSynced ? formatRelative(stats.lastSynced) : "never"}
          </p>
        </div>
        <button className="btn btn--secondary" onClick={handleSync} disabled={syncing}>
          <RefreshIcon className={syncing ? "icon-spin" : ""} />
          {syncing ? "Syncing..." : "Sync now"}
        </button>
      </div>

      {error && <div className="dashboard__error card">{error}</div>}

      {loading && !stats ? (
        <Loader label="Loading your activity..." />
      ) : (
        <>
          <div className="grid dashboard__stats">
            <StatCard
              label="Combined current streak"
              value={stats?.currentStreak ?? 0}
              unit="days"
              sub={stats?.longestStreak ? `Best is ${stats.longestStreak} days` : undefined}
              icon={<FlameIcon />}
              accent="tertiary"
              delay={0}
            />
            <StatCard
              label="GitHub contributions"
              value={insights?.githubTotal ?? 0}
              sub={insights ? `${insights.githubWeekly} this week` : undefined}
              icon={<GitHubIcon />}
              accent="secondary"
              subTone="success"
              delay={60}
            />
            <StatCard
              label="LeetCode attempts"
              value={insights?.leetcodeTotal ?? 0}
              sub={insights ? `${insights.leetcodeWeekly} this week (incl. failed)` : undefined}
              icon={<LeetCodeIcon />}
              accent="tertiary"
              subTone="warning"
              delay={120}
            />
            <StatCard
              label="Consistency score"
              value={`${insights?.consistency ?? 0}%`}
              sub={insights ? `${insights.activeDaysIn30} active days in last 30` : "Active days in last 30"}
              icon={<TrendIcon />}
              accent="primary"
              subTone="primary"
              delay={180}
            />
          </div>

          <div className="card dashboard__heatmap-card fade-up" style={{ animationDelay: "240ms" }}>
            <div className="dashboard__heatmap-header">
              <h2 className="title-lg">Unified activity heatmap</h2>
              <div className="dashboard__heatmap-legend">
                <span><span className="dot dot--github" /> GitHub</span>
                <span><span className="dot dot--leetcode" /> LeetCode</span>
                <span><span className="dot dot--combined" /> Combined</span>
              </div>
            </div>

            <Heatmap days={days} />

            {insights && (
              <div className="dashboard__heatmap-stats">
                <HeatmapStat icon={<FlameIcon />} label="Best streak" value={`${stats?.longestStreak ?? 0} days`} />
                <HeatmapStat icon={<ClockIcon />} label="Most active" value={insights.mostActiveDay} />
                <HeatmapStat icon={<TrendIcon />} label="Peak month" value={insights.peakMonth} />
                <HeatmapStat icon={<CommitIcon />} label="Daily avg (30d)" value={insights.avgPerDay} />
              </div>
            )}
          </div>

          <div className="dashboard__panels">
            <ActivityPanel
              title="GitHub activity"
              accent="secondary"
              icon={<GitHubIcon />}
              rows={[
                { label: "Contributions this week", value: insights?.githubWeekly ?? 0 },
                { label: "Last 12 months", value: insights?.githubTotal ?? 0 },
                { label: "Username", value: `@${user?.githubUsername}`, mono: true },
              ]}
              lastActive={insights?.lastGithub?.date}
              delay={300}
            />
            <ActivityPanel
              title="LeetCode activity"
              accent="tertiary"
              icon={<LeetCodeIcon />}
              rows={[
                { label: "Attempts this week", value: insights?.leetcodeWeekly ?? 0 },
                { label: "Last 12 months (incl. failed)", value: insights?.leetcodeTotal ?? 0 },
                { label: "Username", value: `${user?.leetcodeUsername}`, mono: true },
              ]}
              lastActive={insights?.lastLeetcode?.date}
              delay={360}
            />
          </div>
        </>
      )}
    </div>
  );
};

const HeatmapStat = ({ icon, label, value }) => (
  <div className="heatmap-stat">
    <div className="heatmap-stat__icon">{icon}</div>
    <div>
      <p className="label-md">{label}</p>
      <p className="title-lg">{value}</p>
    </div>
  </div>
);

const ActivityPanel = ({ title, icon, accent, rows, lastActive, delay }) => (
  <div className={`card activity-panel activity-panel--${accent} fade-up`} style={{ animationDelay: `${delay}ms` }}>
    <div className="activity-panel__header">
      <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
      <h3 className="title-lg">{title}</h3>
    </div>

    <div className="activity-panel__rows">
      {rows.map((row) => (
        <div className="activity-panel__row" key={row.label}>
          <span className="body-md activity-panel__row-label">{row.label}</span>
          <span className={row.mono ? "mono" : "title-lg"}>{row.value}</span>
        </div>
      ))}
    </div>

    <div className="activity-panel__footer">
      <span className={`dot dot--${accent === "secondary" ? "github" : "leetcode"}`} />
      <span className="label-md activity-panel__last-active">
        Last active: {lastActive ? formatRelative(lastActive) : "—"}
      </span>
    </div>
  </div>
);

export default Dashboard;