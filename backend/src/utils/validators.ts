import type {
  CreateUserRequestDto,
  UpdateUserRequestDto,
  PatchUserRequestDto
} from "../dtos/users.dto";

import type { ValidationDetail } from "../errors/ApiError";

function isValidEmail(email: string): boolean {
  return email.includes("@");
}

export function validateUser(
  dto: CreateUserRequestDto | UpdateUserRequestDto
): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.name || dto.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long"
    });
  }

  if (!dto.email || !isValidEmail(dto.email)) {
    errors.push({
      field: "email",
      message: "Email must be valid"
    });
  }

  return errors;
}

export function validateUserPatch(
  dto: PatchUserRequestDto
): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (dto.name !== undefined && dto.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be at least 2 characters long"
    });
  }

  if (dto.email !== undefined && !isValidEmail(dto.email)) {
    errors.push({
      field: "email",
      message: "Email must be valid"
    });
  }

  if (dto.name === undefined && dto.email === undefined) {
    errors.push({
      field: "body",
      message: "At least one field must be provided"
    });
  }

  return errors;
}