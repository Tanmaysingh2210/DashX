import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ onMenuClick }) {
  const { logout } = useAuth();

  return (
    <header className="h-14 flex items-center justify-between px-4 md:px-6 border-b border-gray-800 bg-bg">
      <button
        onClick={onMenuClick}
        className="md:hidden text-gray-400 hover:text-white"
      >
        ☰
      </button>

      <div className="font-semibold text-gray-200">
        Dashboard
      </div>

      <button
        onClick={logout}
        className="text-sm text-red-400 hover:text-red-300"
      >
        Logout
      </button>
    </header>
  );
}
