import express, { Request, Response } from "express";

import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import commentsRoutes from "./routes/comments.routes";

import { requestLoggingMiddleware } from "./middleware/request-logging.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorHandlerMiddleware } from "./middleware/error-handler.middleware";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(requestLoggingMiddleware);

app.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    item: {
      ok: true,
    },
  });
});

app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`API started on http://localhost:${PORT}`);
});