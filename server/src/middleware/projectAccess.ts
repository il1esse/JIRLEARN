import type { NextFunction, Request, Response } from "express";
import { prisma } from "../lib/prisma";

async function getMembership(projectId: string, userId: string) {
  return prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
}

export async function requireProjectMember(req: Request, res: Response, next: NextFunction) {
  const projectId = (req.params as Record<string, string>).projectId ?? req.params.id;
  const membership = await getMembership(projectId, req.userId!);
  if (!membership) {
    res.status(403).json({ error: "Not a member of this project" });
    return;
  }
  next();
}

export async function requireProjectOwner(req: Request, res: Response, next: NextFunction) {
  const projectId = (req.params as Record<string, string>).projectId ?? req.params.id;
  const membership = await getMembership(projectId, req.userId!);
  if (!membership || membership.role !== "OWNER") {
    res.status(403).json({ error: "Only the project owner can do this" });
    return;
  }
  next();
}

export async function requireTaskMember(req: Request, res: Response, next: NextFunction) {
  const task = await prisma.task.findUnique({ where: { id: req.params.id as string } });
  if (!task) {
    res.status(404).json({ error: "Task not found" });
    return;
  }
  const membership = await getMembership(task.projectId, req.userId!);
  if (!membership) {
    res.status(403).json({ error: "Not a member of this project" });
    return;
  }
  next();
}
