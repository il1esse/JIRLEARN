import type { Subtask, Tag, Task, User } from "@prisma/client";

type TaskWithRelations = Task & { tags: Tag[]; subtasks: Subtask[] };

export function serializeTask(task: TaskWithRelations) {
  const { tags, ...rest } = task;
  return { ...rest, tagIds: tags.map((tag) => tag.id) };
}

export const taskInclude = { tags: true, subtasks: true } as const;

export function serializeUser(user: User) {
  const { passwordHash: _passwordHash, ...rest } = user;
  return rest;
}
