import { NavLink } from "react-router-dom";
import { useProjectStore } from "../../store/useProjectStore";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium ${
    isActive ? "bg-indigo-600 text-white" : "text-gray-600 hover:bg-gray-100"
  }`;

export function Header() {
  const activeProject = useProjectStore((state) =>
    state.projects.find((p) => p.id === state.activeProjectId),
  );

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold text-gray-900">TaskBoard</span>
          {activeProject && (
            <span className="text-sm text-gray-500">/ {activeProject.name}</span>
          )}
        </div>
        <nav className="flex gap-1">
          <NavLink to="/" end className={navLinkClass}>
            Projets
          </NavLink>
          <NavLink to="/backlog" className={navLinkClass}>
            Backlog
          </NavLink>
          <NavLink to="/board" className={navLinkClass}>
            Board
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
