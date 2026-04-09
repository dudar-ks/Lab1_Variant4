import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export function errorHandlerMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message,
        details: err.details ?? [],
      },
    });
  }

  if (err instanceof Error) {
    const msg = String(err.message);

    if (msg.includes("UNIQUE constraint failed")) {
      return res.status(409).json({
        error: {
          code: "CONFLICT",
          message: "Unique constraint violation",
          details: [],
        },
      });
    }

    if (
      msg.includes("NOT NULL constraint failed") ||
      msg.includes("CHECK constraint failed") ||
      msg.includes("FOREIGN KEY constraint failed")
    ) {
      return res.status(400).json({
        error: {
          code: "VALIDATION_ERROR",
          message: "Database constraint failed",
          details: [],
        },
      });
    }
  }

  console.error(err);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong",
      details: [],
    },
  });
}