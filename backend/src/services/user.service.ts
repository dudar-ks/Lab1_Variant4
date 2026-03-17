import { users } from "../repositories/users.repository";
import {
  toUserResponseDto,
  type CreateUserRequestDto,
  type UpdateUserRequestDto,
  type PatchUserRequestDto,
} from "../dtos/users.dto";
import ApiError from "../errors/ApiError";
import {
  validateCreateUserDto,
  validateUpdateUserDto,
  validatePatchUserDto,
} from "../utils/validators";

type GetUsersOptions = {
  name?: string;
  email?: string;
  sortBy?: "name" | "email";
  sortDir?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export function getUsers(options: GetUsersOptions = {}) {
  let result = [...users];

  if (options.name) {
    result = result.filter((u) =>
      u.name.toLowerCase().includes(options.name!.toLowerCase())
    );
  }

  if (options.email) {
    result = result.filter((u) =>
      u.email.toLowerCase().includes(options.email!.toLowerCase())
    );
  }

  if (options.sortBy) {
    result.sort((a, b) => {
      const valueA = a[options.sortBy!];
      const valueB = b[options.sortBy!];

      if (valueA > valueB) return options.sortDir === "desc" ? -1 : 1;
      if (valueA < valueB) return options.sortDir === "desc" ? 1 : -1;
      return 0;
    });
  }

  const total = result.length;
  const page = options.page ?? 1;
  const pageSize = options.pageSize ?? total;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  const items = result.slice(start, end).map(toUserResponseDto);

  return {
    items,
    total,
  };
}

export function getUserById(id: string) {
  const user = users.find((u) => u.id === id);

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

  const newUser = {
    id: Date.now().toString(),
    name: dto.name,
    email: dto.email,
  };

  users.push(newUser);

  return toUserResponseDto(newUser);
}

export function updateUser(id: string, body: UpdateUserRequestDto) {
  const errors = validateUpdateUserDto(body);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  user.name = body.name;
  user.email = body.email;

  return toUserResponseDto(user);
}

export function patchUser(id: string, body: PatchUserRequestDto) {
  const errors = validatePatchUserDto(body);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const user = users.find((u) => u.id === id);

  if (!user) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  if (body.name !== undefined) {
    user.name = body.name;
  }

  if (body.email !== undefined) {
    user.email = body.email;
  }

  return toUserResponseDto(user);
}

export function deleteUser(id: string) {
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  users.splice(index, 1);
}