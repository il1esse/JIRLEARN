import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Project } from "../types";
import * as projectService from "../services/projectService";

interface ProjectState {
  projects: Project[];
  activeProjectId: string | null;
  loading: boolean;
  loadProjects: () => Promise<void>;
  createProject: (name: string) => Promise<void>;
  renameProject: (id: string, name: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setActiveProject: (id: string | null) => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      projects: [],
      activeProjectId: null,
      loading: false,

      loadProjects: async () => {
        set({ loading: true });
        const projects = await projectService.listProjects();
        const { activeProjectId } = get();
        const stillValid = projects.some((p) => p.id === activeProjectId);
        set({
          projects,
          loading: false,
          activeProjectId: stillValid ? activeProjectId : (projects[0]?.id ?? null),
        });
      },

      createProject: async (name) => {
        const project = await projectService.createProject(name);
        set((state) => ({
          projects: [...state.projects, project],
          activeProjectId: state.activeProjectId ?? project.id,
        }));
      },

      renameProject: async (id, name) => {
        const updated = await projectService.renameProject(id, name);
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? updated : p)),
        }));
      },

      deleteProject: async (id) => {
        await projectService.deleteProject(id);
        set((state) => {
          const projects = state.projects.filter((p) => p.id !== id);
          const activeProjectId =
            state.activeProjectId === id ? (projects[0]?.id ?? null) : state.activeProjectId;
          return { projects, activeProjectId };
        });
      },

      setActiveProject: (id) => set({ activeProjectId: id }),
    }),
    {
      name: "jira_like/ui-active-project",
      partialize: (state) => ({ activeProjectId: state.activeProjectId }),
    },
  ),
);
