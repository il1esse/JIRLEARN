import { useState } from "react";
import { useTaskStore } from "../../store/useTaskStore";
import { TaskCard } from "../tasks/TaskCard";
import { TaskDetailModal } from "../tasks/TaskDetailModal";
import { TaskCreateModal } from "../tasks/TaskCreateModal";
import { BacklogFilters } from "./BacklogFilters";
import type { Task } from "../../types";

export function BacklogView({ projectId }: { projectId: string }) {
  const tasks = useTaskStore((state) => state.tasks);
  const filters = useTaskStore((state) => state.filters);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = tasks.filter((task) => {
    if (filters.status !== "all" && task.status !== filters.status) return false;
    if (filters.tagId !== "all" && !task.tagIds.includes(filters.tagId)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <BacklogFilters />
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Nouvelle tâche
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-500">Aucune tâche ne correspond aux filtres.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={setSelectedTask} />
          ))}
        </div>
      )}

      {creating && <TaskCreateModal projectId={projectId} onClose={() => setCreating(false)} />}
      {selectedTask && (
        <TaskDetailModal
          task={tasks.find((t) => t.id === selectedTask.id) ?? selectedTask}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  );
}
