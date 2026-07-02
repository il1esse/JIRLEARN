import { Router } from "express";
import { prisma } from "../lib/prisma";
import { serializeUser } from "../lib/serialize";
import { hashPassword, signToken, verifyPassword } from "../lib/auth";
import { requireAuth } from "../middleware/auth";

export const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const { email, password, name } = req.body as {
    email?: string;
    password?: string;
    name?: string;
  };
  if (!email || !email.trim() || !password || !name || !name.trim()) {
    res.status(400).json({ error: "email, password and name are required" });
    return;
  }
  if (password.length < 8) {
    res.status(400).json({ error: "password must be at least 8 characters" });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    res.status(409).json({ error: "An account with this email already exists" });
    return;
  }

  const user = await prisma.user.create({
    data: {
      email: normalizedEmail,
      name: name.trim(),
      passwordHash: await hashPassword(password),
    },
  });

  const token = signToken(user.id);
  res.status(201).json({ token, user: serializeUser(user) });
});

authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email: email.trim().toLowerCase() } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    res.status(401).json({ error: "Invalid email or password" });
    return;
  }

  const token = signToken(user.id);
  res.json({ token, user: serializeUser(user) });
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUniqueOrThrow({ where: { id: req.userId! } });
  res.json(serializeUser(user));
});
