import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password } = req.body;

   const ip = req.ip || req.socket.remoteAddress || "unknown";

const result = await authService.login(
  String(email || ""),
  String(password || ""),
  ip
);
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function me(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await authService.getMe(req.user!.id);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "").trim();

    if (!token) {
      return res.status(401).json({
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          details: []
        }
      });
    }

    const result = await authService.logout(token);

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}