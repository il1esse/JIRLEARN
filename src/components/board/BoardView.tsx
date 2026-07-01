import { useState } from "react";
import { STATUSES } from "../../types";
import type { Status, Task } from "../../types";
import { useTaskStore } from "../../store/useTaskStore";
import { BoardColumn } from "./BoardColumn";
import { TaskDetailModal } from "../tasks/TaskDetailModal";
import { TaskCreateModal } from "../tasks/TaskCreateModal";

export function BoardView({ projectId }: { projectId: string }) {
  const tasks = useTaskStore((state) => state.tasks);
  const setTaskStatus = useTaskStore((state) => state.setTaskStatus);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [creating, setCreating] = useState(false);

  const handleDrop = (taskId: string, status: Status) => {
    setTaskStatus(taskId, status);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          + Nouvelle tâche
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STATUSES.map((status) => (
          <BoardColumn
            key={status.value}
            status={status.value}
            tasks={tasks.filter((task) => task.status === status.value)}
            onOpenTask={setSelectedTask}
            onDropTask={handleDrop}
          />
        ))}
      </div>

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
