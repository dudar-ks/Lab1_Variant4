import type { ValidationDetail } from "../errors/ApiError";

export function validateCreatePostDto(dto: {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
}): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.title || dto.title.trim().length < 3) {
    errors.push({ field: "title", message: "Заголовок має містити мінімум 3 символи" });
  }

  if (dto.title && dto.title.trim().length > 80) {
    errors.push({ field: "title", message: "Заголовок має містити максимум 80 символів" });
  }

  if (!dto.category || dto.category.trim().length < 2) {
    errors.push({ field: "category", message: "Оберіть категорію" });
  }

  if (!dto.body || dto.body.trim().length < 5) {
    errors.push({ field: "body", message: "Текст має містити мінімум 5 символів" });
  }

  if (dto.body && dto.body.trim().length > 500) {
    errors.push({ field: "body", message: "Текст має містити максимум 500 символів" });
  }

  if (!dto.author || dto.author.trim().length < 2) {
    errors.push({ field: "author", message: "Автор має містити мінімум 2 символи" });
  }

  if (dto.author && dto.author.trim().length > 60) {
    errors.push({ field: "author", message: "Автор має містити максимум 60 символів" });
  }

  if (!Number.isInteger(Number(dto.userId)) || Number(dto.userId) <= 0) {
    errors.push({ field: "userId", message: "Оберіть користувача" });
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

  if (!dto.text || dto.text.trim().length < 2) {
    errors.push({ field: "text", message: "Коментар має містити мінімум 2 символи" });
  }

  if (dto.text && dto.text.trim().length > 300) {
    errors.push({ field: "text", message: "Коментар має містити максимум 300 символів" });
  }

  if (!Number.isInteger(Number(dto.postId)) || Number(dto.postId) <= 0) {
    errors.push({ field: "postId", message: "Оберіть пост" });
  }

  if (!Number.isInteger(Number(dto.userId)) || Number(dto.userId) <= 0) {
    errors.push({ field: "userId", message: "Оберіть користувача" });
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

export function validateCreateUserDto(dto: {
  name: string;
  email: string;
}): ValidationDetail[] {
  const errors: ValidationDetail[] = [];

  if (!dto.name || dto.name.trim().length < 2) {
    errors.push({ field: "name", message: "Ім’я має містити мінімум 2 символи" });
  }

  if (dto.name && dto.name.trim().length > 60) {
    errors.push({ field: "name", message: "Ім’я має містити максимум 60 символів" });
  }

  if (!dto.email || !dto.email.includes("@")) {
    errors.push({ field: "email", message: "Введіть коректний email" });
  }

  if (dto.email && dto.email.trim().length > 100) {
    errors.push({ field: "email", message: "Email має містити максимум 100 символів" });
  }

  return errors;
}

export function validateUpdateUserDto(dto: {
  name: string;
  email: string;
}): ValidationDetail[] {
  return validateCreateUserDto(dto);
}