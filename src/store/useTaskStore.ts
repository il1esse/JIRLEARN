import { create } from "zustand";
import type { Status, Tag, Task } from "../types";
import * as taskService from "../services/taskService";
import * as tagService from "../services/tagService";
import type { CreateTaskInput, UpdateTaskInput } from "../services/taskService";

export interface TaskFilters {
  status: Status | "all";
  tagId: string | "all";
}

interface TaskState {
  tasks: Task[];
  tags: Tag[];
  filters: TaskFilters;
  loading: boolean;
  loadTasks: (projectId: string) => Promise<void>;
  loadTags: () => Promise<void>;
  createTask: (projectId: string, input: CreateTaskInput) => Promise<void>;
  updateTask: (id: string, patch: UpdateTaskInput) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  setTaskStatus: (id: string, status: Status) => Promise<void>;
  addTagToTask: (id: string, tagName: string) => Promise<void>;
  removeTagFromTask: (id: string, tagId: string) => Promise<void>;
  addSubtask: (taskId: string, title: string) => Promise<void>;
  updateSubtaskStatus: (taskId: string, subtaskId: string, status: Status) => Promise<void>;
  deleteSubtask: (taskId: string, subtaskId: string) => Promise<void>;
  setFilters: (filters: Partial<TaskFilters>) => void;
}

function replaceTask(tasks: Task[], updated: Task): Task[] {
  return tasks.map((t) => (t.id === updated.id ? updated : t));
}

export const useTaskStore = create<TaskState>()((set, get) => ({
  tasks: [],
  tags: [],
  filters: { status: "all", tagId: "all" },
  loading: false,

  loadTasks: async (projectId) => {
    set({ loading: true });
    const tasks = await taskService.listTasks(projectId);
    set({ tasks, loading: false });
  },

  loadTags: async () => {
    const tags = await tagService.listTags();
    set({ tags });
  },

  createTask: async (projectId, input) => {
    const task = await taskService.createTask(projectId, input);
    set((state) => ({ tasks: [...state.tasks, task] }));
    await get().loadTags();
  },

  updateTask: async (id, patch) => {
    const updated = await taskService.updateTask(id, patch);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  deleteTask: async (id) => {
    await taskService.deleteTask(id);
    set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) }));
  },

  setTaskStatus: async (id, status) => {
    const updated = await taskService.setTaskStatus(id, status);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  addTagToTask: async (id, tagName) => {
    const updated = await taskService.addTagToTask(id, tagName);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
    await get().loadTags();
  },

  removeTagFromTask: async (id, tagId) => {
    const updated = await taskService.removeTagFromTask(id, tagId);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  addSubtask: async (taskId, title) => {
    const updated = await taskService.addSubtask(taskId, title);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  updateSubtaskStatus: async (taskId, subtaskId, status) => {
    const updated = await taskService.updateSubtaskStatus(taskId, subtaskId, status);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  deleteSubtask: async (taskId, subtaskId) => {
    const updated = await taskService.deleteSubtask(taskId, subtaskId);
    set((state) => ({ tasks: replaceTask(state.tasks, updated) }));
  },

  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
}));
