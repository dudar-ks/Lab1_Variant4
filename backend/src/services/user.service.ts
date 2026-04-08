import ApiError from "../errors/ApiError";
import { toUserResponseDto } from "../utils/mappers";
import {
  validateCreateUserDto,
  validatePatchUserDto,
  validateUpdateUserDto,
} from "../utils/validators";
import type {
  CreateUserRequestDto,
  PatchUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";
import * as usersRepository from "../repositories/users.repository";

type GetUsersOptions = {
  name?: string;
  email?: string;
  sortBy?: "name" | "email";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export async function getUsers(options: GetUsersOptions = {}) {
  let users = await usersRepository.getUsers();

  if (options.name) {
    users = users.filter((user) =>
      String(user.name).toLowerCase().includes(options.name!.toLowerCase())
    );
  }

  if (options.email) {
    users = users.filter((user) =>
      String(user.email).toLowerCase().includes(options.email!.toLowerCase())
    );
  }

  if (options.sortBy) {
    users.sort((a, b) => {
      const valueA = String(a[options.sortBy!]).toLowerCase();
      const valueB = String(b[options.sortBy!]).toLowerCase();

      if (valueA > valueB) {
        return options.sortDir === "desc" ? -1 : 1;
      }

      if (valueA < valueB) {
        return options.sortDir === "desc" ? 1 : -1;
      }

      return 0;
    });
  }

  const total = users.length;
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : total || 10;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = users.slice(start, end).map(toUserResponseDto);

  return {
    items,
    total,
  };
}

export async function getUserById(id: number) {
  const user = await usersRepository.getUserById(id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  return toUserResponseDto(user);
}

export async function createUser(dto: CreateUserRequestDto) {
  const errors = validateCreateUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const createdUser = await usersRepository.createUser(
    dto.name.trim(),
    dto.email.trim()
  );

  return toUserResponseDto(createdUser);
}

export async function updateUser(id: number, dto: UpdateUserRequestDto) {
  const errors = validateUpdateUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const existingUser = await usersRepository.getUserById(id);

  if (!existingUser) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  throw new ApiError(
    501,
    "NOT_IMPLEMENTED",
    "Update for users is not implemented yet for SQLite version"
  );
}

export async function patchUser(id: number, dto: PatchUserRequestDto) {
  const errors = validatePatchUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const existingUser = await usersRepository.getUserById(id);

  if (!existingUser) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  throw new ApiError(
    501,
    "NOT_IMPLEMENTED",
    "Patch for users is not implemented yet for SQLite version"
  );
}

export async function deleteUser(id: number) {
  const existingUser = await usersRepository.getUserById(id);

  if (!existingUser) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  throw new ApiError(
    501,
    "NOT_IMPLEMENTED",
    "Delete for users is not implemented yet for SQLite version"
  );
}