import express from "express";
import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import commentsRoutes from "./routes/comments.routes";
import { requestLoggingMiddleware } from "./middleware/request-logging.middleware";
import { errorHandlerMiddleware } from "./middleware/error-handler.middleware";

const app = express();

app.use(express.json());
app.use(requestLoggingMiddleware);
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});


app.use("/api/users", usersRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentsRoutes);


app.use(errorHandlerMiddleware);

export default app;