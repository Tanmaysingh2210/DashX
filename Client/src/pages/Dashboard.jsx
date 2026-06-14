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

    // most active weekday
    const weekdayTotals = new Array(7).fill(0);
    const monthTotals = {};
    days.forEach((d) => {
      const date = new Date(d.date);
      weekdayTotals[date.getDay()] += d.totalCount;
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      monthTotals[monthKey] = (monthTotals[monthKey] || 0) + d.totalCount;
    });

    const mostActiveDay = DAY_NAMES[weekdayTotals.indexOf(Math.max(...weekdayTotals))];

    let peakMonth = "—";
    let peakValue = -1;
    Object.entries(monthTotals).forEach(([key, value]) => {
      if (value > peakValue) {
        peakValue = value;
        const [, month] = key.split("-");
        peakMonth = MONTH_NAMES[Number(month)];
      }
    });

    const activeDays = days.filter((d) => d.totalCount > 0);
    const avgPerActiveDay = activeDays.length
      ? (activeDays.reduce((s, d) => s + d.totalCount, 0) / activeDays.length).toFixed(1)
      : "0";

    // last active date per platform
    const lastGithub = [...days].reverse().find((d) => d.githubCount > 0);
    const lastLeetcode = [...days].reverse().find((d) => d.leetcodeCount > 0);

    // last 7 days totals
    const last7 = days.slice(-7);
    const githubWeekly = last7.reduce((s, d) => s + d.githubCount, 0);
    const leetcodeWeekly = last7.reduce((s, d) => s + d.leetcodeCount, 0);

    // consistency — % of last 30 days active
    const last30 = days.slice(-30);
    const activeIn30 = last30.filter((d) => d.totalCount > 0).length;
    const consistency = last30.length ? Math.round((activeIn30 / last30.length) * 100) : 0;

    return {
      githubTotal,
      leetcodeTotal,
      mostActiveDay,
      peakMonth,
      avgPerActiveDay,
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
              label="LeetCode submissions"
              value={insights?.leetcodeTotal ?? 0}
              sub={insights ? `${insights.leetcodeWeekly} this week` : undefined}
              icon={<LeetCodeIcon />}
              accent="tertiary"
              subTone="warning"
              delay={120}
            />
            <StatCard
              label="Consistency score"
              value={`${insights?.consistency ?? 0}%`}
              sub="Active days in last 30"
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
                <HeatmapStat icon={<CommitIcon />} label="Daily avg" value={insights.avgPerActiveDay} />
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
                { label: "All-time contributions", value: insights?.githubTotal ?? 0 },
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
                { label: "Submissions this week", value: insights?.leetcodeWeekly ?? 0 },
                { label: "All-time submissions", value: insights?.leetcodeTotal ?? 0 },
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