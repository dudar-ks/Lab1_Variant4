import type { ValidationDetail } from "../errors/ApiError";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateCreateUserDto(dto: {
  name: string;
  email: string;
}): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.name || dto.name.trim().length < 2) {
    errors.push({ field: "name", message: "Name must be at least 2 characters" });
  }

  if (!dto.email || !isValidEmail(dto.email)) {
    errors.push({ field: "email", message: "Email is invalid" });
  }

  return errors;
}

export function validateUpdateUserDto(dto: {
  name: string;
  email: string;
}): ValidationDetail[] {
  return validateCreateUserDto(dto);
}

export function validateCreatePostDto(dto: {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
}): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.title || dto.title.trim().length < 2) {
    errors.push({ field: "title", message: "Title must be at least 2 characters" });
  }

  if (!dto.category || dto.category.trim().length < 2) {
    errors.push({ field: "category", message: "Category must be at least 2 characters" });
  }

  if (!dto.body || dto.body.trim().length < 3) {
    errors.push({ field: "body", message: "Body must be at least 3 characters" });
  }

  if (!dto.author || dto.author.trim().length < 2) {
    errors.push({ field: "author", message: "Author must be at least 2 characters" });
  }

  if (!Number.isInteger(Number(dto.userId)) || Number(dto.userId) <= 0) {
    errors.push({ field: "userId", message: "UserId must be a positive number" });
  }

  return errors;
}

export function validateUpdatePostDto(dto: {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
}): ValidationDetail[] {
  return validateCreatePostDto(dto);
}

export function validateCreateCommentDto(dto: {
  text: string;
  postId: number;
  userId: number;
}): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.text || dto.text.trim().length < 1) {
    errors.push({ field: "text", message: "Text is required" });
  }

  if (!Number.isInteger(Number(dto.postId)) || Number(dto.postId) <= 0) {
    errors.push({ field: "postId", message: "PostId must be a positive number" });
  }

  if (!Number.isInteger(Number(dto.userId)) || Number(dto.userId) <= 0) {
    errors.push({ field: "userId", message: "UserId must be a positive number" });
  }

  return errors;
}

export function validateUpdateCommentDto(dto: {
  text: string;
  postId: number;
  userId: number;
}): ValidationDetail[] {
  return validateCreateCommentDto(dto);
}