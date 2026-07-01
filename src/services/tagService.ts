import { api } from "../api/client";
import type { Tag } from "../types";

export async function listTags(): Promise<Tag[]> {
  return api.get<Tag[]>("/tags");
}
