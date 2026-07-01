import { api } from "../api/client";
import type { Status, Task } from "../types";

export interface CreateTaskInput {
  title: string;
  description?: string;
  status?: Status;
  tagNames?: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: Status;
}

export async function listTasks(projectId: string): Promise<Task[]> {
  return api.get<Task[]>(`/projects/${projectId}/tasks`);
}

export async function createTask(projectId: string, input: CreateTaskInput): Promise<Task> {
  return api.post<Task>(`/projects/${projectId}/tasks`, input);
}

export async function updateTask(id: string, patch: UpdateTaskInput): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}`, patch);
}

export async function setTaskStatus(id: string, status: Status): Promise<Task> {
  return api.patch<Task>(`/tasks/${id}/status`, { status });
}

export async function deleteTask(id: string): Promise<void> {
  await api.delete<void>(`/tasks/${id}`);
}

export async function addTagToTask(id: string, tagName: string): Promise<Task> {
  return api.post<Task>(`/tasks/${id}/tags`, { tagName });
}

export async function removeTagFromTask(id: string, tagId: string): Promise<Task> {
  return api.delete<Task>(`/tasks/${id}/tags/${tagId}`);
}

export async function addSubtask(taskId: string, title: string): Promise<Task> {
  return api.post<Task>(`/tasks/${taskId}/subtasks`, { title });
}

export async function updateSubtaskStatus(
  taskId: string,
  subtaskId: string,
  status: Status,
): Promise<Task> {
  return api.patch<Task>(`/tasks/${taskId}/subtasks/${subtaskId}/status`, { status });
}

export async function deleteSubtask(taskId: string, subtaskId: string): Promise<Task> {
  return api.delete<Task>(`/tasks/${taskId}/subtasks/${subtaskId}`);
}
