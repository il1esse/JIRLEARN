import type { Status, Task } from "../../types";
import { STATUSES } from "../../types";
import { TaskCard } from "../tasks/TaskCard";

interface BoardColumnProps {
  status: Status;
  tasks: Task[];
  onOpenTask: (task: Task) => void;
  onDropTask: (taskId: string, status: Status) => void;
}

export function BoardColumn({ status, tasks, onOpenTask, onDropTask }: BoardColumnProps) {
  const label = STATUSES.find((s) => s.value === status)?.label ?? status;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("text/task-id");
    if (taskId) onDropTask(taskId, status);
  };

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex min-h-[300px] w-full flex-col gap-2 rounded-md bg-gray-100 p-3"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className="text-xs text-gray-400">{tasks.length}</span>
      </div>
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("text/task-id", task.id)}
          >
            <TaskCard task={task} onOpen={onOpenTask} />
          </div>
        ))}
      </div>
    </div>
  );
}
