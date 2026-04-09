import ApiError from "../errors/ApiError";
import { toUserResponseDto } from "../utils/mappers";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";
import * as usersRepository from "../repositories/users.repository";
import {
  validateCreateUserDto,
  validateUpdateUserDto,
} from "../utils/validators";

type GetUsersOptions = {
  name?: string;
  email?: string;
  sortBy?: "id" | "name" | "email";
  sortDir?: "asc" | "desc";
};

export async function getUsers(options: GetUsersOptions = {}) {
  const users = await usersRepository.getUsers(options);

  return {
    items: users.map(toUserResponseDto),
    total: users.length,
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

  const updatedUser = await usersRepository.updateUser(
    id,
    dto.name.trim(),
    dto.email.trim()
  );

  if (!updatedUser) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  return toUserResponseDto(updatedUser);
}

export async function deleteUser(id: number) {
  const deleted = await usersRepository.deleteUser(id);

  if (!deleted) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }
}