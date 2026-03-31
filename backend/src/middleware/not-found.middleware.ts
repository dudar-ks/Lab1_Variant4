import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";

export function notFoundMiddleware(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new ApiError(404, "NOT_FOUND", "Route not found"));
}