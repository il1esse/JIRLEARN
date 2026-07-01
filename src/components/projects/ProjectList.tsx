import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectStore } from "../../store/useProjectStore";

export function ProjectList() {
  const projects = useProjectStore((state) => state.projects);
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const setActiveProject = useProjectStore((state) => state.setActiveProject);
  const renameProject = useProjectStore((state) => state.renameProject);
  const deleteProject = useProjectStore((state) => state.deleteProject);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const navigate = useNavigate();

  const startEditing = (id: string, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const commitRename = async (id: string) => {
    const trimmed = editingName.trim();
    if (trimmed) await renameProject(id, trimmed);
    setEditingId(null);
  };

  const handleSelect = (id: string) => {
    setActiveProject(id);
    navigate("/backlog");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce projet et toutes ses tâches ?")) return;
    await deleteProject(id);
  };

  if (projects.length === 0) {
    return (
      <p className="text-sm text-gray-500">Aucun projet pour l'instant. Crée le premier ci-dessus.</p>
    );
  }

  return (
    <ul className="divide-y divide-gray-200 rounded-md border border-gray-200 bg-white">
      {projects.map((project) => (
        <li
          key={project.id}
          className={`flex items-center justify-between px-4 py-3 ${
            project.id === activeProjectId ? "bg-indigo-50" : ""
          }`}
        >
          {editingId === project.id ? (
            <input
              autoFocus
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => commitRename(project.id)}
              onKeyDown={(e) => e.key === "Enter" && commitRename(project.id)}
              className="flex-1 rounded-md border border-gray-300 px-2 py-1 text-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => handleSelect(project.id)}
              className="flex-1 text-left text-sm font-medium text-gray-900 hover:text-indigo-600"
            >
              {project.name}
            </button>
          )}
          <div className="flex gap-3 text-xs">
            <button
              type="button"
              onClick={() => startEditing(project.id, project.name)}
              className="text-gray-500 hover:text-indigo-600"
            >
              Renommer
            </button>
            <button
              type="button"
              onClick={() => handleDelete(project.id)}
              className="text-gray-500 hover:text-red-600"
            >
              Supprimer
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
