import { posts } from "../repositories/posts.repository";
import ApiError from "../errors/ApiError";
import { toPostResponseDto } from "../utils/mappers";
import {
  validateCreatePostDto,
  validateUpdatePostDto,
} from "../utils/validators";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "../dtos/posts.dto";
import type { Post } from "../types/post.types";

function getNextPostId(): number {
  if (posts.length === 0) {
    return 1;
  }

  return Math.max(...posts.map((post) => post.id)) + 1;
}

export function getPosts() {
  return {
    items: posts.map(toPostResponseDto),
    total: posts.length,
  };
}

export function getPostById(id: number) {
  const post = posts.find((item) => item.id === id);

  if (!post) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  return toPostResponseDto(post);
}

export function createPost(dto: CreatePostRequestDto) {
  const errors = validateCreatePostDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const newPost: Post = {
    id: getNextPostId(),
    title: dto.title.trim(),
    category: dto.category.trim(),
    body: dto.body.trim(),
    author: dto.author.trim(),
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);

  return toPostResponseDto(newPost);
}

export function updatePost(id: number, dto: UpdatePostRequestDto) {
  const post = posts.find((item) => item.id === id);

  if (!post) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  const errors = validateUpdatePostDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  post.title = dto.title.trim();
  post.category = dto.category.trim();
  post.body = dto.body.trim();
  post.author = dto.author.trim();

  return toPostResponseDto(post);
}

export function deletePost(id: number) {
  const index = posts.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  posts.splice(index, 1);
}