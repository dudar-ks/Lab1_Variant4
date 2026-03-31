import { NextFunction, Request, Response } from "express";
import * as userService from "../services/user.service";
import ApiError from "../errors/ApiError";
import type {
  CreateUserRequestDto,
  PatchUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";

export function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page =
      typeof req.query.page === "string" ? Number(req.query.page) : undefined;
    const pageSize =
      typeof req.query.pageSize === "string"
        ? Number(req.query.pageSize)
        : undefined;

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
      page: page !== undefined && !Number.isNaN(page) ? page : undefined,
      pageSize:
        pageSize !== undefined && !Number.isNaN(pageSize)
          ? pageSize
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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const user = userService.getUserById(id);

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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const user = userService.updateUser(id, req.body);

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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const user = userService.patchUser(id, req.body);

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
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "User id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    userService.deleteUser(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}