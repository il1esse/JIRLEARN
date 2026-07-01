import "dotenv/config";
import express from "express";
import cors from "cors";
import { projectsRouter } from "./routes/projects";
import { tagsRouter } from "./routes/tags";
import { projectTasksRouter, taskRouter } from "./routes/tasks";

const app = express();

const allowedOrigins = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.use("/api/projects/:projectId/tasks", projectTasksRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/tags", tagsRouter);

app.use(
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  },
);

const port = process.env.PORT ?? 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
