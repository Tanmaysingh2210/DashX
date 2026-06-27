import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

// ── mini heatmap data for the dashboard preview ──
const PREVIEW_WEEKS = Array.from({ length: 20 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => {
    const r = Math.random();
    if (r > 0.72) return "github";
    if (r > 0.55) return "leetcode";
    if (r > 0.45) return "both";
    return "empty";
  })
);

const Home = () => {
  const { isAuthenticated, loading, loginWithGitHub } = useAuth();
  const navigate = useNavigate();
  const glowRef = useRef(null);

  useEffect(() => {
    if (!loading && isAuthenticated) navigate("/dashboard", { replace: true });
  }, [loading, isAuthenticated, navigate]);

  // subtle parallax on the glow orb
  useEffect(() => {
    const handleMove = (e) => {
      if (!glowRef.current) return;
      const x = (e.clientX / window.innerWidth  - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      glowRef.current.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="home">
      {/* ── ambient background glows ── */}
      <div className="home__glow-orb home__glow-orb--main" ref={glowRef} />
      <div className="home__glow-orb home__glow-orb--secondary" />

      {/* ═══════════════════════════════════════
          HERO
      ═══════════════════════════════════════ */}
      <section className="home__hero page">
        {/* left — copy */}
        <div className="home__hero-left">
          <div className="home__eyebrow">
            <span className="home__eyebrow-icon">✦</span>
            All your progress. One dashboard.
          </div>

          <h1 className="home__headline">
            Track your<br />
            <span className="home__headline-accent">coding consistency,</span><br />
            not just commits.
          </h1>

          <p className="home__subtitle">
            Combine your GitHub contributions and LeetCode progress
            into a single developer dashboard. Monitor streaks, analyze
            patterns, and stay accountable — every day.
          </p>

          <button className="home__cta-btn" onClick={loginWithGitHub}>
            <GitHubRoundIcon />
            Continue with GitHub
            <span className="home__cta-arrow">→</span>
          </button>

          <p className="home__cta-note">
            <ShieldIcon />
            GitHub authenticates your account.<br />
            You'll connect your LeetCode profile during onboarding.
          </p>

          <div className="home__trust">
            <TrustBadge icon={<LockIcon />}    label="Secure & private"    sub="Your data stays yours" />
            <div className="home__trust-divider" />
            <TrustBadge icon={<ZapIcon />}     label="Quick setup"         sub="Takes less than 10 seconds" />
            <div className="home__trust-divider" />
            <TrustBadge icon={<GroupIcon />}   label="Built for developers" sub="Loved by devs worldwide" />
          </div>
        </div>

        {/* right — floating dashboard mockup */}
        <div className="home__hero-right">
          <div className="home__dashboard-wrapper">
            <div className="home__card-glow" />
            <div className="home__dashboard-card">
              {/* card header */}
              <div className="home__card-header">
                <div className="home__card-avatar">DX</div>
                <div>
                  <p className="home__card-label">Welcome back,</p>
                  <p className="home__card-username">Tanmay👋</p>
                </div>
                <button className="home__card-view-btn" onClick={loginWithGitHub}>
                  View full dashboard →
                </button>
              </div>

              {/* mini stat row */}
              <div className="home__card-stats">
                <MiniStat
                  label="Current Streak"
                  value="29"
                  unit="days"
                  sub="Best: 29 days"
                  icon="🔥"
                  accent="tertiary"
                />
                <MiniStat
                  label="GitHub Contributions"
                  value="534"
                  sub="this week"
                  subColor="secondary"
                  icon={<GitHubSmallIcon />}
                  accent="secondary"
                />
                <MiniStat
                  label="LeetCode Solved"
                  value="514"
                  sub="this week"
                  subColor="tertiary"
                  icon={<LeetCodeSmallIcon />}
                  accent="tertiary"
                />
              </div>

              {/* mini heatmap */}
              <div className="home__card-heatmap">
                <div className="home__card-heatmap-header">
                  <span className="home__card-section-label">Activity Heatmap</span>
                  <div className="home__card-heatmap-legend">
                    <span>Less</span>
                    {[1,2,3,4].map((l) => (
                      <span key={l} className={`home__card-heatmap-swatch home__swatch--both-${l}`} />
                    ))}
                    <span>More</span>
                  </div>
                </div>

                <div className="home__card-heatmap-months">
                  {["Jan","Feb","Mar","Apr","May","Jun"].map((m) => (
                    <span key={m}>{m}</span>
                  ))}
                </div>

                <div className="home__card-heatmap-grid">
                  {PREVIEW_WEEKS.map((week, wi) => (
                    <div key={wi} className="home__card-heatmap-col">
                      {week.map((type, di) => (
                        <span
                          key={di}
                          className={`home__card-heatmap-cell home__cell--${type}`}
                          style={{ animationDelay: `${wi * 30 + di * 10}ms` }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* bottom mini stats */}
              <div className="home__card-bottom-stats">
                <BottomStat icon="📅" label="Most Active Day" value="Sunday" />
                <BottomStat icon="📈" label="Peak Month"      value="August" />
                <BottomStat
                  icon={<ConsistencyRing pct={97} />}
                  label="Consistency Score"
                  value="97%"
                  wide
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          PLATFORMS ROW
      ═══════════════════════════════════════ */}
      <section className="home__platforms page">
        <p className="home__platforms-label">Built to work with the tools you use</p>
        <div className="home__platforms-list">
          <PlatformPill
            logo={<GitHubLogo />}
            name="GitHub"
            status="Connected"
            statusType="connected"
          />
          <PlatformPill
            logo={<LeetCodeLogo />}
            name="LeetCode"
            status="Connect next"
            statusType="next"
          />
          <PlatformPill
            logo={<CodeforcesLogo />}
            name="Codeforces"
            status="Upcoming"
            statusType="upcoming"
          />
          <PlatformPill
            logo={<HackerRankLogo />}
            name="HackerRank"
            status="Upcoming"
            statusType="upcoming"
          />
        </div>
      </section>
    </div>
  );
};

// ── sub-components ──────────────────────────────────────────

const TrustBadge = ({ icon, label, sub }) => (
  <div className="home__trust-badge">
    <span className="home__trust-icon">{icon}</span>
    <div>
      <p className="home__trust-label">{label}</p>
      <p className="home__trust-sub">{sub}</p>
    </div>
  </div>
);

const MiniStat = ({ label, value, unit, sub, subColor, icon, accent }) => (
  <div className={`home__mini-stat home__mini-stat--${accent}`}>
    <div className="home__mini-stat-top">
      <span className="home__mini-stat-label">{label}</span>
      <span className="home__mini-stat-icon">{icon}</span>
    </div>
    <p className="home__mini-stat-value">
      {value} {unit && <span className="home__mini-stat-unit">{unit}</span>}
    </p>
    {sub && (
      <p className={`home__mini-stat-sub home__mini-stat-sub--${subColor || "default"}`}>
        {sub}
      </p>
    )}
  </div>
);

const BottomStat = ({ icon, label, value, wide }) => (
  <div className={`home__bottom-stat ${wide ? "home__bottom-stat--wide" : ""}`}>
    <div className="home__bottom-stat-icon">{icon}</div>
    <p className="home__bottom-stat-label">{label}</p>
    <p className="home__bottom-stat-value">{value}</p>
  </div>
);

const ConsistencyRing = ({ pct }) => {
  const r  = 16;
  const c  = 2 * Math.PI * r;
  const dash = (pct / 100) * c;
  return (
    <svg width="40" height="40" viewBox="0 0 40 40">
      <circle cx="20" cy="20" r={r} fill="none" stroke="rgba(192,132,252,0.15)" strokeWidth="3" />
      <circle
        cx="20" cy="20" r={r} fill="none"
        stroke="#c084fc" strokeWidth="3"
        strokeDasharray={`${dash} ${c - dash}`}
        strokeLinecap="round"
        transform="rotate(-90 20 20)"
      />
      <text x="20" y="24" textAnchor="middle" fill="#c084fc" fontSize="10" fontWeight="600">
        {pct}%
      </text>
    </svg>
  );
};

const PlatformPill = ({ logo, name, status, statusType }) => (
  <div className="home__platform-pill">
    <span className="home__platform-logo">{logo}</span>
    <span className="home__platform-name">{name}</span>
    <span className={`home__platform-status home__platform-status--${statusType}`}>
      {statusType === "connected" && "✓ "}
      {statusType === "next"      && "⟳ "}
      {status}
    </span>
  </div>
);

// ── inline SVG icons ────────────────────────────────────────

const GitHubRoundIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.5 5.7 18.3.5 12 .5z"/>
  </svg>
);
const GitHubSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.5 5.7 18.3.5 12 .5z"/>
  </svg>
);
const LeetCodeSmallIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m9 18-6-6 6-6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" strokeLinecap="round"/>
  </svg>
);
const ZapIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M13 2 4 13h6l-1 9 9-11h-6l1-9z" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const GroupIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round"/>
  </svg>
);
const GitHubLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.2 9.2 7.7 10.7.6.1.8-.2.8-.6v-2.2c-3.1.7-3.8-1.3-3.8-1.3-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.1 1.7 1.1 1 1.7 2.6 1.2 3.2.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.2-5.1-5.5 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2.9-.3 1.9-.4 2.9-.4s2 .1 2.9.4c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.7.8 1.1 1.8 1.1 3 0 4.3-2.6 5.2-5.1 5.5.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6 4.5-1.5 7.7-5.7 7.7-10.7C23.5 5.7 18.3.5 12 .5z"/>
  </svg>
);
const LeetCodeLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffb867" strokeWidth="1.8">
    <path d="m9 18-6-6 6-6M15 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const CodeforcesLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
    <rect x="2"  y="12" width="5" height="10" rx="1" fill="#818cf8"/>
    <rect x="9"  y="6"  width="5" height="16" rx="1" fill="#a78bfa"/>
    <rect x="16" y="2"  width="5" height="20" rx="1" fill="#c084fc"/>
  </svg>
);
const HackerRankLogo = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="#22c55e">
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1 14.5v-2.2c-1.2-.4-2-1.5-2-2.8s.8-2.4 2-2.8V6.5h2v2.2c1.2.4 2 1.5 2 2.8s-.8 2.4-2 2.8v2.2h-2z"/>
  </svg>
);

export default Home;