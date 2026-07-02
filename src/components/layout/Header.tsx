import { NavLink, useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/useProjectStore";
import { useAuthStore } from "../../store/useAuthStore";
import { ThemeToggle } from "./ThemeToggle";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive
      ? "bg-indigo-600 text-white"
      : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
  }`;

export function Header() {
  const activeProject = useProjectStore((state) =>
    state.projects.find((p) => p.id === state.activeProjectId),
  );
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-900 dark:text-gray-100">TaskBoard</span>
          {activeProject && (
            <span className="text-sm text-gray-500 dark:text-gray-400">/ {activeProject.name}</span>
          )}
        </div>
        <nav className="flex items-center gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Projets
          </NavLink>
          <NavLink to="/backlog" className={navLinkClass}>
            Backlog
          </NavLink>
          <NavLink to="/board" className={navLinkClass}>
            Board
          </NavLink>
          <div className="ml-4 flex items-center gap-3 border-l border-gray-200 pl-4 dark:border-gray-800">
            {user && <span className="text-sm text-gray-600 dark:text-gray-300">{user.name}</span>}
            <ThemeToggle />
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-medium text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
            >
              Déconnexion
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}
