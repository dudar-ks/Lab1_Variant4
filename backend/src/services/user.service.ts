import { users } from "../repositories/users.repository";
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
import type { User } from "../types/user.types";

type GetUsersOptions = {
  name?: string;
  email?: string;
  sortBy?: "name" | "email";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

function getNextUserId(): number {
  if (users.length === 0) {
    return 1;
  }

  return Math.max(...users.map((user) => user.id)) + 1;
}

export function getUsers(options: GetUsersOptions = {}) {
  let result = [...users];

  if (options.name) {
    result = result.filter((user) =>
      user.name.toLowerCase().includes(options.name!.toLowerCase())
    );
  }

  if (options.email) {
    result = result.filter((user) =>
      user.email.toLowerCase().includes(options.email!.toLowerCase())
    );
  }

  if (options.sortBy) {
    result.sort((a, b) => {
      const valueA = a[options.sortBy!].toLowerCase();
      const valueB = b[options.sortBy!].toLowerCase();

      if (valueA > valueB) {
        return options.sortDir === "desc" ? -1 : 1;
      }

      if (valueA < valueB) {
        return options.sortDir === "desc" ? 1 : -1;
      }

      return 0;
    });
  }

  const total = result.length;
  const page = options.page && options.page > 0 ? options.page : 1;
  const pageSize =
    options.pageSize && options.pageSize > 0 ? options.pageSize : total || 10;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = result.slice(start, end).map(toUserResponseDto);

  return {
    items,
    total,
  };
}

export function getUserById(id: number) {
  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  return toUserResponseDto(user);
}

export function createUser(dto: CreateUserRequestDto) {
  const errors = validateCreateUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const newUser: User = {
    id: getNextUserId(),
    name: dto.name.trim(),
    email: dto.email.trim(),
  };

  users.push(newUser);

  return toUserResponseDto(newUser);
}

export function updateUser(id: number, dto: UpdateUserRequestDto) {
  const errors = validateUpdateUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  user.name = dto.name.trim();
  user.email = dto.email.trim();

  return toUserResponseDto(user);
}

export function patchUser(id: number, dto: PatchUserRequestDto) {
  const errors = validatePatchUserDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const user = users.find((item) => item.id === id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  if (dto.name !== undefined) {
    user.name = dto.name.trim();
  }

  if (dto.email !== undefined) {
    user.email = dto.email.trim();
  }

  return toUserResponseDto(user);
}

export function deleteUser(id: number) {
  const index = users.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  users.splice(index, 1);
}