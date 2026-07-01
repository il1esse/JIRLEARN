import { api } from "../api/client";
import type { Project } from "../types";

export async function listProjects(): Promise<Project[]> {
  return api.get<Project[]>("/projects");
}

export async function createProject(name: string): Promise<Project> {
  return api.post<Project>("/projects", { name });
}

export async function renameProject(id: string, name: string): Promise<Project> {
  return api.patch<Project>(`/projects/${id}`, { name });
}

export async function deleteProject(id: string): Promise<void> {
  await api.delete<void>(`/projects/${id}`);
}
