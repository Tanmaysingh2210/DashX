import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const NAV_LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/activity", label: "Activity" },
  { to: "/settings", label: "Settings" },
];

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__inner page">
        <NavLink to="/" className="navbar__brand">
          DashX
        </NavLink>

        {isAuthenticated && (
          <nav className="navbar__links">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "navbar__link navbar__link--active" : "navbar__link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="navbar__actions">
          {isAuthenticated ? (
            <>
              <button
                className="navbar__icon-btn"
                aria-label="Notifications"
                type="button"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <button
                className="navbar__avatar"
                onClick={handleLogout}
                title="Log out"
                type="button"
              >
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.githubUsername} />
                ) : (
                  <span>{user?.githubUsername?.[0]?.toUpperCase() || "?"}</span>
                )}
              </button>
            </>
          ) : (
            <button className="btn btn--primary" onClick={() => navigate("/")}>
              Get Started
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;