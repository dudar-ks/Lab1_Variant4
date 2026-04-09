import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await userService.getUsers({
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      email: typeof req.query.email === "string" ? req.query.email : undefined,
      sortBy:
        req.query.sortBy === "id" ||
        req.query.sortBy === "name" ||
        req.query.sortBy === "email"
          ? req.query.sortBy
          : undefined,
      sortDir:
        req.query.sortDir === "asc" || req.query.sortDir === "desc"
          ? req.query.sortDir
          : undefined,
    });

    res.status(200).json(result);
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
    const result = await userService.getUserById(id);

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createUser(
  req: Request<{}, {}, CreateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await userService.createUser(req.body);

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateUser(
  req: Request<{ id: string }, {}, UpdateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);
    const result = await userService.updateUser(id, req.body);

    res.status(200).json(result);
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
    await userService.deleteUser(id);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}