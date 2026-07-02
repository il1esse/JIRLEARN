import { api } from "../api/client";
import type { User } from "../types";

export interface AuthResponse {
  token: string;
  user: User;
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/register", { email, password, name });
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  return api.post<AuthResponse>("/auth/login", { email, password });
}

export async function me(): Promise<User> {
  return api.get<User>("/auth/me");
}
