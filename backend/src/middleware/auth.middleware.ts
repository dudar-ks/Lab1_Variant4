import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import * as authRepository from "../repositories/auth.repository";
import { isTokenBlacklisted } from "../services/token-blacklist.service";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

type AppJwtPayload = {
  sub: number;
  email: string;
  role: "user" | "admin";
};

function isAppJwtPayload(value: unknown): value is AppJwtPayload {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const payload = value as Record<string, unknown>;

  return (
    typeof payload.sub === "number" &&
    Number.isFinite(payload.sub) &&
    typeof payload.email === "string" &&
    (payload.role === "user" || payload.role === "admin")
  );
}

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
    return;
  }

  const token = authHeader.replace("Bearer ", "").trim();

  if (isTokenBlacklisted(token)) {
    next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!isAppJwtPayload(decoded)) {
      next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
      return;
    }

    const user = await authRepository.getUserById(decoded.sub);

    if (!user) {
      next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
      return;
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    next();
  } catch {
    next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
  }
}

export function requireRole(role: "user" | "admin") {
  return function (req: Request, _res: Response, next: NextFunction) {
    if (!req.user) {
      next(new ApiError(401, "UNAUTHORIZED", "Unauthorized"));
      return;
    }

    if (req.user.role !== role) {
      next(new ApiError(403, "FORBIDDEN", "Forbidden"));
      return;
    }

    next();
  };
} 