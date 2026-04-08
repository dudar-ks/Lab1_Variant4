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
import * as postsRepository from "../repositories/posts.repository";

export async function getPosts() {
  const posts = await postsRepository.getPosts();

  return {
    items: posts.map(toPostResponseDto),
    total: posts.length,
  };
}

export async function getPostById(id: number) {
  const post = await postsRepository.getPostById(id);

  if (!post) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  return toPostResponseDto(post);
}

export async function createPost(dto: CreatePostRequestDto) {
  const errors = validateCreatePostDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const createdPost = await postsRepository.createPost(
    dto.title.trim(),
    dto.category.trim(),
    dto.body.trim(),
    dto.author.trim(),
    Number(dto.userId)
  );

  return toPostResponseDto(createdPost);
}

export async function updatePost(id: number, dto: UpdatePostRequestDto) {
  const existingPost = await postsRepository.getPostById(id);

  if (!existingPost) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  const errors = validateUpdatePostDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  throw new ApiError(
    501,
    "NOT_IMPLEMENTED",
    "Update for posts is not implemented yet for SQLite version"
  );
}

export async function deletePost(id: number) {
  const existingPost = await postsRepository.getPostById(id);

  if (!existingPost) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  throw new ApiError(
    501,
    "NOT_IMPLEMENTED",
    "Delete for posts is not implemented yet for SQLite version"
  );
}