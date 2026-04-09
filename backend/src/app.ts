import express from "express";

import usersRoutes from "./routes/users.routes.js";
import postsRoutes from "./routes/posts.routes.js";
import commentsRoutes from "./routes/comments.routes.js";

import { errorHandlerMiddleware } from "./middleware/error-handler.middleware.js";

const app = express();

app.use(express.json());

// healthcheck
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);

// error handler
app.use(errorHandlerMiddleware);

export default app;