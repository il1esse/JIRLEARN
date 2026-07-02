import { api } from "../api/client";
import type { Project, ProjectMember } from "../types";

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

export async function getMembers(projectId: string): Promise<ProjectMember[]> {
  return api.get<ProjectMember[]>(`/projects/${projectId}/members`);
}

export async function inviteMember(projectId: string, email: string): Promise<ProjectMember> {
  return api.post<ProjectMember>(`/projects/${projectId}/invite`, { email });
}

export async function removeMember(projectId: string, userId: string): Promise<void> {
  await api.delete<void>(`/projects/${projectId}/members/${userId}`);
}
