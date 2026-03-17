import { posts } from "../repositories/posts.repository.js";
import ApiError from "../errors/ApiError.js";
import { validatePost } from "../utils/validators.js";
import { toPostResponseDto } from "../utils/mappers.js";

import type { Post } from "../types/post.types.js";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
  PostResponseDto
} from "../dtos/posts.dto.js";

export function getPosts(): PostResponseDto[] {
  return posts.map(toPostResponseDto);
}

export function getPostById(id: string): PostResponseDto {
  const post = posts.find((p) => p.id === id);

  if (!post) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  return toPostResponseDto(post);
}

export function createPost(body: unknown): PostResponseDto {
  const dto = body as CreatePostRequestDto;
  const errors = validatePost(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const post: Post = {
    id: Date.now().toString(),
    title: dto.title,
    category: dto.category,
    body: dto.body,
    author: dto.author,
    createdAt: new Date().toISOString()
  };

  posts.push(post);

  return toPostResponseDto(post);
}

export function updatePost(id: string, body: unknown): PostResponseDto {
  const post = posts.find((p) => p.id === id);

  if (!post) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  const dto = body as UpdatePostRequestDto;
  const errors = validatePost(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  post.title = dto.title;
  post.category = dto.category;
  post.body = dto.body;
  post.author = dto.author;

  return toPostResponseDto(post);
}

export function deletePost(id: string): void {
  const index = posts.findIndex((p) => p.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  posts.splice(index, 1);
}