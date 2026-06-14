import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GitHubIcon, LeetCodeIcon, FlameIcon, TrendIcon } from "../components/Icons";
import "./Home.css";

// sample data purely for the landing-page preview heatmap —
// real users see their actual data once logged in
const PREVIEW_CELLS = [0, 1, 2, 1, 0, 3, 2, 4, 1, 0, 2, 3, 1, 2, 4, 3, 0, 1, 2, 3];

const Home = () => {
  const { isAuthenticated, loading, loginWithGitHub } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  return (
    <div className="home">
      <div className="home__glow" aria-hidden="true" />

      <section className="page home__hero">
        <span className="pill pill--success pill--dot fade-up">Beta access available</span>

        <h1 className="display home__title fade-up" style={{ animationDelay: "60ms" }}>
          Track your coding{" "}
          <span className="home__title--accent">consistency</span>
        </h1>

        <p className="body-lg home__subtitle fade-up" style={{ animationDelay: "120ms" }}>
          Combine your GitHub contributions and LeetCode progress into a single developer
          dashboard. Monitor streaks, analyze patterns, and stay accountable — every day.
        </p>

        <div className="home__cta fade-up" style={{ animationDelay: "180ms" }}>
          <button className="btn btn--primary" onClick={loginWithGitHub}>
            <GitHubIcon />
            Connect GitHub
          </button>
          <button className="btn btn--tertiary" onClick={loginWithGitHub}>
            <LeetCodeIcon />
            Connect LeetCode
          </button>
        </div>
        <p className="label-md home__cta-note fade-up" style={{ animationDelay: "220ms" }}>
          Sign in with GitHub first — you'll link your LeetCode profile right after
        </p>

        <div className="home__preview card fade-up" style={{ animationDelay: "280ms" }}>
          <div className="home__preview-profile">
            <div className="home__preview-avatar">DX</div>
            <div>
              <p className="title-lg">@dev_explorer</p>
              <p className="label-md home__preview-joined">
                <CalendarMini /> Joined March 2023
              </p>
            </div>
            <span className="home__preview-badge">Lvl 42 · Pro</span>
          </div>

          <div className="home__preview-stats">
            <div className="home__preview-stat">
              <div className="home__preview-stat-icon home__preview-stat-icon--tertiary">
                <FlameIcon />
              </div>
              <div>
                <p className="label-md">Combined coding streak</p>
                <p className="headline-md">
                  14 <span className="home__preview-unit">days</span>
                </p>
              </div>
            </div>
            <div className="home__preview-stat">
              <div className="home__preview-stat-icon home__preview-stat-icon--primary">
                <TrendIcon />
              </div>
              <div>
                <p className="label-md">Total activity score</p>
                <p className="headline-md">2,450</p>
              </div>
            </div>
          </div>

          <div className="home__preview-activity">
            <p className="label-md">Recent activity</p>
            <div className="home__preview-cells">
              {PREVIEW_CELLS.map((lvl, i) => (
                <span
                  key={i}
                  className={`heatmap__cell heatmap__cell--lvl${lvl}`}
                  style={{ animationDelay: `${320 + i * 18}ms` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="page home__features">
        <Feature
          icon={<GitHubIcon />}
          accent="secondary"
          title="GitHub contributions"
          text="Every commit, PR, and review pulled directly from your contribution calendar — going back to your very first commit."
          delay={0}
        />
        <Feature
          icon={<LeetCodeIcon />}
          accent="tertiary"
          title="LeetCode submissions"
          text="Your full submission history, problem difficulty breakdown, and active-day streaks — synced automatically."
          delay={80}
        />
        <Feature
          icon={<FlameIcon />}
          accent="primary"
          title="One unified streak"
          text="A single combined heatmap and streak counter, so a LeetCode grind day counts just as much as a shipping day."
          delay={160}
        />
      </section>
    </div>
  );
};

const Feature = ({ icon, title, text, accent, delay }) => (
  <div className="card card--interactive home__feature fade-up" style={{ animationDelay: `${delay}ms` }}>
    <div className={`stat-card__icon stat-card__icon--${accent}`}>{icon}</div>
    <h3 className="title-lg">{title}</h3>
    <p className="body-md">{text}</p>
  </div>
);

const CalendarMini = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: "-2px", marginRight: "4px" }}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round" />
  </svg>
);

export default Home;