import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import ApiError from "../errors/ApiError";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto
} from "../dtos/users.dto";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const users = await userService.getUsers({
      email: typeof req.query.email === "string" ? req.query.email : undefined,
      sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined
    });

    return res.status(200).json({ items: users });
  } catch (error) {
    next(error);
  }
}

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    const user = await userService.getUserById(id);
    return res.status(200).json({ item: user });
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request<Record<string, never>, Record<string, never>, CreateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json({ item: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request<{ id: string }, Record<string, never>, UpdateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    const user = await userService.updateUser(id, req.body);
    return res.status(200).json({ item: user });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    await userService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}