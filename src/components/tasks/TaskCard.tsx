import type { Task } from "../../types";
import { useTaskStore } from "../../store/useTaskStore";
import { useTaskProgress } from "../../hooks/useTaskProgress";

interface TaskCardProps {
  task: Task;
  onOpen: (task: Task) => void;
}

export function TaskCard({ task, onOpen }: TaskCardProps) {
  const tags = useTaskStore((state) => state.tags);
  const progress = useTaskProgress(task);
  const taskTags = tags.filter((tag) => task.tagIds.includes(tag.id));

  return (
    <button
      type="button"
      onClick={() => onOpen(task)}
      className="flex w-full flex-col gap-2 rounded-md border border-gray-200 bg-white p-3 text-left shadow-sm hover:border-indigo-300 hover:shadow"
    >
      <p className="text-sm font-medium text-gray-900">{task.title}</p>
      {task.description && (
        <p className="line-clamp-2 text-xs text-gray-500">{task.description}</p>
      )}
      {taskTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {taskTags.map((tag) => (
            <span
              key={tag.id}
              className="rounded-full px-2 py-0.5 text-[10px] text-white"
              style={{ backgroundColor: tag.color }}
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}
      {progress.total > 0 && (
        <div className="flex items-center gap-2">
          <div className="h-1.5 flex-1 rounded-full bg-gray-100">
            <div
              className="h-1.5 rounded-full bg-indigo-500"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500">{progress.ratioLabel}</span>
        </div>
      )}
    </button>
  );
}
