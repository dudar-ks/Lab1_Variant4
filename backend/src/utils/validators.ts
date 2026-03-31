import type {
  CreateUserRequestDto,
  PatchUserRequestDto,
  UpdateUserRequestDto,
} from "../dtos/users.dto";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "../dtos/posts.dto";
import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from "../dtos/comments.dto";
import type { ValidationDetail } from "../errors/ApiError";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function validateCreateUserDto(body: unknown): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!isRecord(body)) {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  if (typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Name must be a non-empty string with at least 2 characters",
    });
  }

  if (
    typeof body.email !== "string" ||
    body.email.trim().length < 5 ||
    !isValidEmail(body.email.trim())
  ) {
    errors.push({
      field: "email",
      message: "Email must be a valid email address",
    });
  }

  return errors;
}

export function validateUpdateUserDto(
  body: unknown
): ValidationDetail[] {
  return validateCreateUserDto(body);
}

export function validatePatchUserDto(body: unknown): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!isRecord(body)) {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  if ("name" in body) {
    if (typeof body.name !== "string" || body.name.trim().length < 2) {
      errors.push({
        field: "name",
        message: "Name must be a non-empty string with at least 2 characters",
      });
    }
  }

  if ("email" in body) {
    if (
      typeof body.email !== "string" ||
      body.email.trim().length < 5 ||
      !isValidEmail(body.email.trim())
    ) {
      errors.push({
        field: "email",
        message: "Email must be a valid email address",
      });
    }
  }

  if (!("name" in body) && !("email" in body)) {
    errors.push({
      field: "body",
      message: "At least one field must be provided",
    });
  }

  return errors;
}

export function validateCreatePostDto(body: unknown): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!isRecord(body)) {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  if (typeof body.title !== "string" || body.title.trim().length < 2) {
    errors.push({
      field: "title",
      message: "Title must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof body.category !== "string" || body.category.trim().length < 2) {
    errors.push({
      field: "category",
      message: "Category must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof body.body !== "string" || body.body.trim().length < 5) {
    errors.push({
      field: "body",
      message: "Body must be a non-empty string with at least 5 characters",
    });
  }

  if (typeof body.author !== "string" || body.author.trim().length < 2) {
    errors.push({
      field: "author",
      message: "Author must be a non-empty string with at least 2 characters",
    });
  }

  return errors;
}

export function validateUpdatePostDto(body: unknown): ValidationDetail[] {
  return validateCreatePostDto(body);
}

export function validateCreateCommentDto(body: unknown): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!isRecord(body)) {
    return [{ field: "body", message: "Request body must be an object" }];
  }

  if (typeof body.text !== "string" || body.text.trim().length < 2) {
    errors.push({
      field: "text",
      message: "Text must be a non-empty string with at least 2 characters",
    });
  }

  if (typeof body.postId !== "number" || Number.isNaN(body.postId)) {
    errors.push({
      field: "postId",
      message: "PostId must be a valid number",
    });
  }

  if (typeof body.userId !== "number" || Number.isNaN(body.userId)) {
    errors.push({
      field: "userId",
      message: "UserId must be a valid number",
    });
  }

  return errors;
}

export function validateUpdateCommentDto(
  body: unknown
): ValidationDetail[] {
  return validateCreateCommentDto(body);

  
}