import { Router } from "express";
import { prisma } from "../lib/prisma";

export const projectsRouter = Router();

projectsRouter.get("/", async (_req, res) => {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "asc" } });
  res.json(projects);
});

projectsRouter.post("/", async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const project = await prisma.project.create({ data: { name: name.trim() } });
  res.status(201).json(project);
});

projectsRouter.patch("/:id", async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const project = await prisma.project.update({
    where: { id: req.params.id },
    data: { name: name.trim() },
  });
  res.json(project);
});

projectsRouter.delete("/:id", async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id } });
  res.status(204).end();
});
