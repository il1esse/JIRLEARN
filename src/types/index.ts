export type Status = "todo" | "in_progress" | "done" | "obsolete";

export const STATUSES: { value: Status; label: string }[] = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminé" },
  { value: "obsolete", label: "Obsolète" },
];

export interface Tag {
  id: string;
  name: string;
  color: string;
}

export interface Subtask {
  id: string;
  taskId: string;
  title: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: Status;
  tagIds: string[];
  subtasks: Subtask[];
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type ProjectRole = "OWNER" | "MEMBER";

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  user: User;
}
