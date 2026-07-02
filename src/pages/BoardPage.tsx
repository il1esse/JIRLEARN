import { useEffect } from "react";
import { useProjectStore } from "../store/useProjectStore";
import { useTaskStore } from "../store/useTaskStore";
import { NoActiveProject } from "../components/layout/NoActiveProject";
import { BoardView } from "../components/board/BoardView";

export function BoardPage() {
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
      <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Board</h1>
      <BoardView projectId={activeProjectId} />
    </div>
  );
}
