export type ValidationError = {
  field: string;
  message: string;
};

export function validateCreateUserDto(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  const dto = body as Record<string, unknown>;

  if (typeof dto.name !== "string" || dto.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof dto.email !== "string" || dto.email.trim().length < 5) {
    errors.push({
      field: "email",
      message: "Email must be a non-empty string with at least 5 characters",
    });
  }

  return errors;
}

export function validateUpdateUserDto(body: unknown): ValidationError[] {
  return validateCreateUserDto(body);
}

export function validatePatchUserDto(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  const dto = body as Record<string, unknown>;

  if ("name" in dto) {
    if (typeof dto.name !== "string" || dto.name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Name must be a non-empty string with at least 2 characters",
      });
    }
  }

  if ("email" in dto) {
    if (typeof dto.email !== "string" || dto.email.trim().length < 5) {
      errors.push({
        field: "email",
        message: "Email must be a non-empty string with at least 5 characters",
      });
    }
  }

  if (!("name" in dto) && !("email" in dto)) {
    errors.push({
      field: "body",
      message: "At least one field must be provided",
    });
  }

  return errors;
}