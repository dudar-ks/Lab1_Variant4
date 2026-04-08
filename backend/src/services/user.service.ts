import ApiError from "../errors/ApiError";
import { toUserResponseDto } from "../utils/mappers";
import {
  validateCreateUserDto,
  validateUpdateUserDto,
} from "../utils/validators";
import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";
import * as usersRepository from "../repositories/users.repository";

type GetUsersOptions = {
  email?: string;
  sort?: string;
  order?: string;
};

export async function getUsers(options: GetUsersOptions = {}) {
  const users = await usersRepository.getUsers({
    email: options.email,
    sort: options.sort,
    order: options.order,
  });

  return users.map(toUserResponseDto);
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

  try {
    const createdUser = await usersRepository.createUser(
      dto.name.trim(),
      dto.email.trim()
    );

    return toUserResponseDto(createdUser);
  } catch (error: any) {
    const message = String(error?.message || "");

    if (message.includes("UNIQUE constraint failed")) {
      throw new ApiError(409, "CONFLICT", "Email already exists", [
        { field: "email", message: "Email already exists" },
      ]);
    }

    throw error;
  }
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

  try {
    const updatedUser = await usersRepository.updateUser(
      id,
      dto.name.trim(),
      dto.email.trim()
    );

    if (!updatedUser) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }

    return toUserResponseDto(updatedUser);
  } catch (error: any) {
    const message = String(error?.message || "");

    if (message.includes("UNIQUE constraint failed")) {
      throw new ApiError(409, "CONFLICT", "Email already exists", [
        { field: "email", message: "Email already exists" },
      ]);
    }

    throw error;
  }
}

export async function deleteUser(id: number) {
  const existingUser = await usersRepository.getUserById(id);

  if (!existingUser) {
    throw new ApiError(404, "NOT_FOUND", "User not found");
  }

  try {
    const deleted = await usersRepository.deleteUser(id);

    if (!deleted) {
      throw new ApiError(404, "NOT_FOUND", "User not found");
    }

    return;
  } catch (error: any) {
    const message = String(error?.message || "");

    if (message.includes("FOREIGN KEY constraint failed")) {
      throw new ApiError(
        409,
        "CONFLICT",
        "User cannot be deleted because related records exist"
      );
    }

    throw error;
  }
}