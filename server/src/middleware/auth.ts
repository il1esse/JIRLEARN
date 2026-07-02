import type { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : undefined;
  if (!token) {
    res.status(401).json({ error: "Authentication required" });
    return;
  }
  try {
    const { userId } = verifyToken(token);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}
