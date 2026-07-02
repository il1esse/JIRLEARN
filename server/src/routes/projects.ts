import { Router } from "express";
import { prisma } from "../lib/prisma";
import { serializeUser } from "../lib/serialize";
import { requireAuth } from "../middleware/auth";
import { requireProjectMember, requireProjectOwner } from "../middleware/projectAccess";

export const projectsRouter = Router();

projectsRouter.use(requireAuth);

projectsRouter.get("/", async (req, res) => {
  const projects = await prisma.project.findMany({
    where: { members: { some: { userId: req.userId! } } },
    orderBy: { createdAt: "asc" },
  });
  res.json(projects);
});

projectsRouter.post("/", async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const project = await prisma.project.create({
    data: {
      name: name.trim(),
      members: { create: { userId: req.userId!, role: "OWNER" } },
    },
  });
  res.status(201).json(project);
});

projectsRouter.patch("/:id", requireProjectOwner, async (req, res) => {
  const { name } = req.body as { name?: string };
  if (!name || !name.trim()) {
    res.status(400).json({ error: "name is required" });
    return;
  }
  const project = await prisma.project.update({
    where: { id: req.params.id as string },
    data: { name: name.trim() },
  });
  res.json(project);
});

projectsRouter.delete("/:id", requireProjectOwner, async (req, res) => {
  await prisma.project.delete({ where: { id: req.params.id as string } });
  res.status(204).end();
});

projectsRouter.get("/:id/members", requireProjectMember, async (req, res) => {
  const members = await prisma.projectMember.findMany({
    where: { projectId: req.params.id as string },
    include: { user: true },
    orderBy: { createdAt: "asc" },
  });
  res.json(
    members.map((member) => ({
      userId: member.userId,
      role: member.role,
      user: serializeUser(member.user),
    })),
  );
});

projectsRouter.post("/:id/invite", requireProjectOwner, async (req, res) => {
  const { email } = req.body as { email?: string };
  if (!email || !email.trim()) {
    res.status(400).json({ error: "email is required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user) {
    res.status(404).json({ error: "No account found with this email" });
    return;
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId: req.params.id as string, userId: user.id } },
  });
  if (existingMembership) {
    res.status(409).json({ error: "This user is already a member of the project" });
    return;
  }

  const member = await prisma.projectMember.create({
    data: { projectId: req.params.id as string, userId: user.id, role: "MEMBER" },
  });
  res.status(201).json({ userId: member.userId, role: member.role, user: serializeUser(user) });
});

projectsRouter.delete("/:id/members/:userId", requireProjectOwner, async (req, res) => {
  const projectId = req.params.id as string;
  const userId = req.params.userId as string;
  const membership = await prisma.projectMember.findUnique({
    where: { projectId_userId: { projectId, userId } },
  });
  if (membership?.role === "OWNER") {
    res.status(400).json({ error: "Cannot remove the project owner" });
    return;
  }
  await prisma.projectMember.deleteMany({
    where: { projectId, userId },
  });
  res.status(204).end();
});
