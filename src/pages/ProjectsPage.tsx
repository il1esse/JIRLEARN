import { useEffect } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { ProjectForm } from "../components/projects/ProjectForm";
import { ProjectList } from "../components/projects/ProjectList";

export function ProjectsPage() {
  const loadProjects = useProjectStore((state) => state.loadProjects);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Projets</h1>
        <p className="text-sm text-gray-500">Sélectionne un projet pour voir son backlog et son board.</p>
      </div>
      <ProjectForm />
      <ProjectList />
    </div>
  );
}
