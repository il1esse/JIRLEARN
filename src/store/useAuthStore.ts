import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "../types";
import * as authService from "../services/authService";
import { setTokenGetter, setUnauthorizedHandler } from "../api/client";

interface AuthState {
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,

      login: async (email, password) => {
        const { token, user } = await authService.login(email, password);
        set({ token, user });
      },

      register: async (email, password, name) => {
        const { token, user } = await authService.register(email, password, name);
        set({ token, user });
      },

      logout: () => set({ token: null, user: null }),
    }),
    { name: "jira_like/auth" },
  ),
);

setTokenGetter(() => useAuthStore.getState().token);
setUnauthorizedHandler(() => useAuthStore.getState().logout());
