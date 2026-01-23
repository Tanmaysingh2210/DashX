import { NavLink } from "react-router-dom";

export default function Sidebar({ open, setOpen }) {
  return (
    <>
      {/* Overlay for tablet */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static z-40
          w-64 bg-card border-r border-gray-800
          h-full transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-6 text-xl font-semibold text-accent">
          DashX
        </div>

        <nav className="px-4 space-y-2">
          <NavLink to="/dashboard" className="block px-3 py-2 rounded hover:bg-gray-800">
            Dashboard
          </NavLink>
          <NavLink to="/platforms" className="block px-3 py-2 rounded hover:bg-gray-800">
            Platforms
          </NavLink>
          <NavLink to="/goals" className="block px-3 py-2 rounded hover:bg-gray-800">
            Goals
          </NavLink>
        </nav>
      </aside>
    </>
  );
}
