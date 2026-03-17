export type ValidationError = {
  field: string;
  message: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

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

  if (
    typeof dto.email !== "string" ||
    dto.email.trim().length < 5 ||
    !isValidEmail(dto.email.trim())
  ) {
    errors.push({
      field: "email",
      message: "Email must be a valid email address",
    });
  }

  return errors;
}

export function validateUpdateUserDto(body: unknown): ValidationError[] {
  return validateCreateUserDto(body);
}

export function validateCreatePostDto(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  const dto = body as Record<string, unknown>;

  if (typeof dto.title !== "string" || dto.title.trim().length < 2) {
    errors.push({
      field: "title",
      message: "Title must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof dto.category !== "string" || dto.category.trim().length < 2) {
    errors.push({
      field: "category",
      message: "Category must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof dto.body !== "string" || dto.body.trim().length < 5) {
    errors.push({
      field: "body",
      message: "Body must be a non-empty string with at least 5 characters",
    });
  }

  if (typeof dto.author !== "string" || dto.author.trim().length < 2) {
    errors.push({
      field: "author",
      message: "Author must be a non-empty string with at least 2 characters",
    });
  }

  return errors;
}

export function validateUpdatePostDto(body: unknown): ValidationError[] {
  return validateCreatePostDto(body);
}

export function validateCreateCommentDto(body: unknown): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!body || typeof body !== "object") {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  const dto = body as Record<string, unknown>;

  if (typeof dto.text !== "string" || dto.text.trim().length < 2) {
    errors.push({
      field: "text",
      message: "Text must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof dto.postId !== "string" || dto.postId.trim().length === 0) {
    errors.push({
      field: "postId",
      message: "PostId must be a non-empty string",
    });
  }

  if (typeof dto.userId !== "string" || dto.userId.trim().length === 0) {
    errors.push({
      field: "userId",
      message: "UserId must be a non-empty string",
    });
  }

  return errors;
}

export function validateUpdateCommentDto(body: unknown): ValidationError[] {
  return validateCreateCommentDto(body);
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
    if (
      typeof dto.email !== "string" ||
      dto.email.trim().length < 5 ||
      !isValidEmail(dto.email.trim())
    ) {
      errors.push({
        field: "email",
        message: "Email must be a valid email address",
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