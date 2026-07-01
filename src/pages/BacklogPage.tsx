import { useEffect } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";
import { NoActiveProject } from "../components/layout/NoActiveProject";
import { BacklogView } from "../components/backlog/BacklogView";

export function BacklogPage() {
  const activeProjectId = useProjectStore((state) => state.activeProjectId);
  const loadTasks = useTaskStore((state) => state.loadTasks);
  const loadTags = useTaskStore((state) => state.loadTags);

  useEffect(() => {
    if (activeProjectId) loadTasks(activeProjectId);
    loadTags();
  }, [activeProjectId, loadTasks, loadTags]);

  if (!activeProjectId) return <NoActiveProject />;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-semibold text-gray-900">Backlog</h1>
      <BacklogView projectId={activeProjectId} />
    </div>
  );
}
