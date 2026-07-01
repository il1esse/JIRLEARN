import type { Task } from "../types";

export interface TaskProgress {
  done: number;
  total: number;
  ratioLabel: string;
  percent: number;
}

export function useTaskProgress(task: Task): TaskProgress {
  const total = task.subtasks.length;
  const done = task.subtasks.filter((s) => s.status === "done").length;
  const percent = total === 0 ? 0 : Math.round((done / total) * 100);
  return { done, total, ratioLabel: `${done}/${total}`, percent };
}
