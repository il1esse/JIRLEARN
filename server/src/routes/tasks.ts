import { Router } from "express";
import { prisma } from "../lib/prisma";
import { serializeTask, taskInclude } from "../lib/serialize";
import { findOrCreateTag } from "./tags";
import { requireAuth } from "../middleware/auth";
import { requireProjectMember, requireTaskMember } from "../middleware/projectAccess";

export const projectTasksRouter = Router({ mergeParams: true });
export const taskRouter = Router();

projectTasksRouter.use(requireAuth, requireProjectMember);
taskRouter.use(requireAuth);
taskRouter.use("/:id", requireTaskMember);

projectTasksRouter.get("/", async (req, res) => {
  const projectId = (req.params as Record<string, string>).projectId;
  const tasks = await prisma.task.findMany({
    where: { projectId },
    include: taskInclude,
    orderBy: { createdAt: "asc" },
  });
  res.json(tasks.map(serializeTask));
});

projectTasksRouter.post("/", async (req, res) => {
  const projectId = (req.params as Record<string, string>).projectId;
  const { title, description, status, tagNames } = req.body as {
    title?: string;
    description?: string;
    status?: string;
    tagNames?: string[];
  };
  if (!title || !title.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const tags = [];
  for (const name of tagNames ?? []) {
    tags.push(await findOrCreateTag(name));
  }

  const task = await prisma.task.create({
    data: {
      projectId,
      title: title.trim(),
      description: description ?? "",
      status: (status as never) ?? undefined,
      tags: { connect: tags.map((tag) => ({ id: tag.id })) },
    },
    include: taskInclude,
  });
  res.status(201).json(serializeTask(task));
});

taskRouter.patch("/:id", async (req, res) => {
  const { title, description, status } = req.body as {
    title?: string;
    description?: string;
    status?: string;
  };
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(status !== undefined ? { status: status as never } : {}),
    },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});

taskRouter.delete("/:id", async (req, res) => {
  await prisma.task.delete({ where: { id: req.params.id } });
  res.status(204).end();
});

taskRouter.patch("/:id/status", async (req, res) => {
  const { status } = req.body as { status: string };
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { status: status as never },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});

taskRouter.post("/:id/tags", async (req, res) => {
  const { tagName } = req.body as { tagName: string };
  const tag = await findOrCreateTag(tagName);
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { tags: { connect: { id: tag.id } } },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});

taskRouter.delete("/:id/tags/:tagId", async (req, res) => {
  const task = await prisma.task.update({
    where: { id: req.params.id },
    data: { tags: { disconnect: { id: req.params.tagId } } },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});

taskRouter.post("/:id/subtasks", async (req, res) => {
  const { title } = req.body as { title: string };
  await prisma.subtask.create({ data: { taskId: req.params.id, title } });
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: req.params.id },
    include: taskInclude,
  });
  res.status(201).json(serializeTask(task));
});

taskRouter.patch("/:id/subtasks/:subtaskId/status", async (req, res) => {
  const { status } = req.body as { status: string };
  await prisma.subtask.update({
    where: { id: req.params.subtaskId },
    data: { status: status as never },
  });
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: req.params.id },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});

taskRouter.delete("/:id/subtasks/:subtaskId", async (req, res) => {
  await prisma.subtask.delete({ where: { id: req.params.subtaskId } });
  const task = await prisma.task.findUniqueOrThrow({
    where: { id: req.params.id },
    include: taskInclude,
  });
  res.json(serializeTask(task));
});
