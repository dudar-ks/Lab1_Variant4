import ApiError from "../errors/ApiError";
import { toPostResponseDto } from "../utils/mappers";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "../dtos/posts.dto";
import * as postsRepository from "../repositories/posts.repository";
import { validateCreatePostDto, validateUpdatePostDto } from "../utils/validators";

export async function getPosts(options: {
  category?: string;
  author?: string;
  userId?: number;
  sort?: string;
  order?: string;
}) {
  const posts = await postsRepository.getPosts(options);

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
  const errors = validateUpdatePostDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const updatedPost = await postsRepository.updatePost(
    id,
    dto.title.trim(),
    dto.category.trim(),
    dto.body.trim(),
    dto.author.trim(),
    Number(dto.userId)
  );

  if (!updatedPost) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }

  return toPostResponseDto(updatedPost);
}

export async function deletePost(id: number) {
  const deleted = await postsRepository.deletePost(id);

  if (!deleted) {
    throw new ApiError(404, "NOT_FOUND", "Post not found");
  }
}
