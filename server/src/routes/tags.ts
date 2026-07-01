import { Router } from "express";
import { prisma } from "../lib/prisma";

export const tagsRouter = Router();

const PALETTE = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#06b6d4",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

tagsRouter.get("/", async (_req, res) => {
  const tags = await prisma.tag.findMany({ orderBy: { name: "asc" } });
  res.json(tags);
});

export async function findOrCreateTag(name: string) {
  const trimmed = name.trim();
  const existing = await prisma.tag.findFirst({
    where: { name: { equals: trimmed, mode: "insensitive" } },
  });
  if (existing) return existing;

  const count = await prisma.tag.count();
  return prisma.tag.create({
    data: { name: trimmed, color: PALETTE[count % PALETTE.length] },
  });
}
