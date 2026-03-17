import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  PatchUserRequestDto,
} from "../dtos/users.dto";

export function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = userService.getUsers({
      name: typeof req.query.name === "string" ? req.query.name : undefined,
      email: typeof req.query.email === "string" ? req.query.email : undefined,
      sortBy:
        req.query.sortBy === "name" || req.query.sortBy === "email"
          ? req.query.sortBy
          : undefined,
      sortDir:
        req.query.sortDir === "asc" || req.query.sortDir === "desc"
          ? req.query.sortDir
          : undefined,
      page:
        typeof req.query.page === "string" ? Number(req.query.page) : undefined,
      pageSize:
        typeof req.query.pageSize === "string"
          ? Number(req.query.pageSize)
          : undefined,
    });

    return res.status(200).json({
      items: result.items,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export function getUserById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = userService.getUserById(req.params.id);

    return res.status(200).json({
      item: user,
    });
  } catch (error) {
    next(error);
  }
}

export function createUser(
  req: Request<{}, {}, CreateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = userService.createUser(req.body);

    return res.status(201).json({
      item: user,
    });
  } catch (error) {
    next(error);
  }
}

export function updateUser(
  req: Request<{ id: string }, {}, UpdateUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = userService.updateUser(req.params.id, req.body);

    return res.status(200).json({
      item: user,
    });
  } catch (error) {
    next(error);
  }
}

export function patchUser(
  req: Request<{ id: string }, {}, PatchUserRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const user = userService.patchUser(req.params.id, req.body);

    return res.status(200).json({
      item: user,
    });
  } catch (error) {
    next(error);
  }
}

export function deleteUser(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    userService.deleteUser(req.params.id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}