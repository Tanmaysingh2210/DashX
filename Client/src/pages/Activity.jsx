import { useEffect, useMemo } from "react";
import { useActivity } from "../context/ActivityContext";
import StatCard from "../components/StatCard";
import Loader from "../components/Loader";
import {
  FlameIcon,
  CalendarIcon,
  CodeIcon,
  SparklesIcon,
  TrendIcon,
  ClockIcon,
  ZapIcon,
  GitHubIcon,
  LeetCodeIcon,
} from "../components/Icons";
import "./Activity.css";

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today - date) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

const Activity = () => {
  const { days, stats, loading, error, loadAll } = useActivity();

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const data = useMemo(() => {
    if (!days.length) return null;

    const last7 = days.slice(-7);
    const last30 = days.slice(-30);

    const weeklyActivity = last7.reduce((s, d) => s + d.totalCount, 0);
    const activeDays30 = last30.filter((d) => d.totalCount > 0).length;
    const problemsThisWeek = last7.reduce((s, d) => s + d.leetcodeCount, 0);

    const githubLast30 = last30.reduce((s, d) => s + d.githubCount, 0);
    const leetcodeLast30 = last30.reduce((s, d) => s + d.leetcodeCount, 0);
    const total30 = githubLast30 + leetcodeLast30;

    const githubPct = total30 ? Math.round((githubLast30 / total30) * 100) : 0;
    const leetcodePct = total30 ? 100 - githubPct : 0;
    const activeDaysPct = Math.round((activeDays30 / last30.length) * 100);

    const dailyAvg = activeDays30 ? (total30 / activeDays30).toFixed(1) : "0";

    // ── timeline: most recent active days, newest first ──
    const timeline = [...days]
      .reverse()
      .filter((d) => d.totalCount > 0)
      .slice(0, 6);

    // ── insights, computed from real numbers ──
    const prev7 = days.slice(-14, -7);
    const prevWeekly = prev7.reduce((s, d) => s + d.totalCount, 0);
    const velocityChange =
      prevWeekly > 0 ? Math.round(((weeklyActivity - prevWeekly) / prevWeekly) * 100) : null;

    // weekday with most total activity
    const weekdayTotals = new Array(7).fill(0);
    days.forEach((d) => {
      weekdayTotals[new Date(d.date).getDay()] += d.totalCount;
    });
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const peakDay = dayNames[weekdayTotals.indexOf(Math.max(...weekdayTotals))];

    return {
      weeklyActivity,
      activeDays30,
      problemsThisWeek,
      githubPct,
      leetcodePct,
      activeDaysPct,
      dailyAvg,
      timeline,
      velocityChange,
      peakDay,
      githubLast30,
      leetcodeLast30,
    };
  }, [days]);

  return (
    <div className="page activity-page fade-in">
      <div className="activity-page__header">
        <h1 className="headline-lg">Activity &amp; insights</h1>
        <p className="body-md">Analyze your coding patterns across GitHub and LeetCode.</p>
      </div>

      {error && <div className="dashboard__error card">{error}</div>}

      {loading && !stats ? (
        <Loader label="Loading insights..." />
      ) : (
        <>
          <div className="grid activity-page__stats">
            <StatCard
              label="Weekly activity"
              value={data?.weeklyActivity ?? 0}
              sub="actions this week"
              icon={<TrendIcon />}
              accent="primary"
              delay={0}
            />
            <StatCard
              label="Current streak"
              value={stats?.currentStreak ?? 0}
              unit="days"
              sub={stats?.longestStreak ? `Best is ${stats.longestStreak} days` : undefined}
              icon={<FlameIcon />}
              accent="tertiary"
              delay={60}
            />
            <StatCard
              label="Active days"
              value={`${data?.activeDays30 ?? 0} / 30`}
              sub="last 30 days"
              icon={<CalendarIcon />}
              accent="secondary"
              delay={120}
            />
            <StatCard
              label="Problems solved"
              value={data?.problemsThisWeek ?? 0}
              sub="this week"
              icon={<CodeIcon />}
              accent="tertiary"
              subTone="warning"
              delay={180}
            />
          </div>

          <div className="activity-page__main">
            <div className="card activity-page__timeline fade-up" style={{ animationDelay: "240ms" }}>
              <h2 className="title-lg activity-page__section-title">Recent activity timeline</h2>

              {data?.timeline?.length ? (
                <ul className="timeline">
                  {data.timeline.map((day, i) => (
                    <li key={day.date} className="timeline__item fade-up" style={{ animationDelay: `${280 + i * 50}ms` }}>
                      <div className="timeline__rail">
                        <span className="timeline__dot" />
                        {i < data.timeline.length - 1 && <span className="timeline__line" />}
                      </div>
                      <div className="timeline__content">
                        <div className="timeline__meta">
                          <span className="label-md">{formatDate(day.date)}</span>
                        </div>
                        <div className="timeline__entries">
                          {day.githubCount > 0 && (
                            <div className="timeline__entry">
                              <span className="stat-card__icon stat-card__icon--secondary timeline__icon">
                                <GitHubIcon width={14} height={14} />
                              </span>
                              <span className="body-md">
                                {day.githubCount} GitHub contribution{day.githubCount > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                          {day.leetcodeCount > 0 && (
                            <div className="timeline__entry">
                              <span className="stat-card__icon stat-card__icon--tertiary timeline__icon">
                                <LeetCodeIcon width={14} height={14} />
                              </span>
                              <span className="body-md">
                                {day.leetcodeCount} LeetCode submission{day.leetcodeCount > 1 ? "s" : ""}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="body-md">No recent activity yet — sync your profiles to get started.</p>
              )}
            </div>

            <div className="activity-page__insights">
              <h2 className="title-lg activity-page__section-title">
                <SparklesIcon /> Insights
              </h2>

              <InsightCard
                icon={<TrendIcon />}
                accent="secondary"
                title="Weekly velocity"
                delay={240}
              >
                {data?.velocityChange === null && "Keep going to start tracking week-over-week trends."}
                {data?.velocityChange !== null && data?.velocityChange >= 0 && (
                  <>
                    Your activity is up{" "}
                    <strong className="insight-card__highlight insight-card__highlight--secondary">
                      {data.velocityChange}%
                    </strong>{" "}
                    compared to last week.
                  </>
                )}
                {data?.velocityChange < 0 && (
                  <>
                    Activity is down{" "}
                    <strong className="insight-card__highlight insight-card__highlight--tertiary">
                      {Math.abs(data.velocityChange)}%
                    </strong>{" "}
                    from last week — a good day to get back on track.
                  </>
                )}
              </InsightCard>

              <InsightCard icon={<ClockIcon />} accent="primary" title="Peak productivity" delay={300}>
                You're most active on{" "}
                <strong className="insight-card__highlight insight-card__highlight--primary">
                  {data?.peakDay ?? "—"}
                </strong>
                . Plan your hardest problems for that day.
              </InsightCard>

              <InsightCard icon={<ZapIcon />} accent="tertiary" title="Algorithm focus" delay={360}>
                You solved{" "}
                <strong className="insight-card__highlight insight-card__highlight--tertiary">
                  {data?.leetcodeLast30 ?? 0} LeetCode problems
                </strong>{" "}
                in the last 30 days.
              </InsightCard>

              <InsightCard icon={<GitHubIcon />} accent="secondary" title="Shipping pace" delay={420}>
                <strong className="insight-card__highlight insight-card__highlight--secondary">
                  {data?.githubLast30 ?? 0} GitHub contributions
                </strong>{" "}
                logged over the last 30 days.
              </InsightCard>
            </div>
          </div>

          <div className="card activity-page__breakdown fade-up" style={{ animationDelay: "480ms" }}>
            <h2 className="title-lg activity-page__section-title">Activity breakdown (last 30 days)</h2>

            <div className="breakdown">
              <BreakdownBar label="GitHub activity" pct={data?.githubPct ?? 0} color="secondary" delay={520} />
              <BreakdownBar label="LeetCode activity" pct={data?.leetcodePct ?? 0} color="tertiary" delay={580} />
              <BreakdownBar
                label="Active days"
                pct={data?.activeDaysPct ?? 0}
                sublabel={`${data?.activeDays30 ?? 0} out of 30 days`}
                color="primary"
                delay={640}
              />
              <div className="breakdown__avg">
                <span className="label-md">Daily average</span>
                <p className="display breakdown__avg-value">{data?.dailyAvg ?? "0"}</p>
                <span className="body-md">contributions</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const InsightCard = ({ icon, accent, title, children, delay }) => (
  <div className="card insight-card fade-up" style={{ animationDelay: `${delay}ms` }}>
    <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
    <div>
      <h3 className="title-lg insight-card__title">{title}</h3>
      <p className="body-md">{children}</p>
    </div>
  </div>
);

const BreakdownBar = ({ label, pct, sublabel, color, delay }) => (
  <div className="breakdown__row fade-up" style={{ animationDelay: `${delay}ms` }}>
    <div className="breakdown__row-header">
      <span className="body-md">{label}</span>
      <span className="title-lg">{pct}%</span>
    </div>
    <div className="breakdown__track">
      <div
        className={`breakdown__fill breakdown__fill--${color}`}
        style={{ width: `${pct}%`, animationDelay: `${delay + 100}ms` }}
      />
    </div>
    {sublabel && <span className="label-md breakdown__sublabel">{sublabel}</span>}
  </div>
);

export default Activity;