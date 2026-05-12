import express from "express";
import cors from "cors";

import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";
import commentsRoutes from "./routes/comments.routes";
import authRoutes from "./routes/auth.routes";

import { requestLoggingMiddleware } from "./middleware/request-logging.middleware";
import { notFoundMiddleware } from "./middleware/not-found.middleware";
import { errorHandlerMiddleware } from "./middleware/error-handler.middleware";

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Demo-UserId"]
};
app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "no-referrer");
  next();
});

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(requestLoggingMiddleware);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", usersRoutes);
app.use("/api/v1/posts", postsRoutes);
app.use("/api/v1/comments", commentsRoutes);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

export default app;