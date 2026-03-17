import { comments } from "../repositories/comments.repository.js";
import ApiError from "../errors/ApiError.js";
import { validateComment } from "../utils/validators.js";
import { toCommentResponseDto } from "../utils/mappers.js";

import type { CommentEntity } from "../types/comment.types.js";
import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
  CommentResponseDto
} from "../dtos/comments.dto.js";

export function getComments(): CommentResponseDto[] {
  return comments.map(toCommentResponseDto);
}

export function getCommentById(id: string): CommentResponseDto {
  const comment = comments.find((c) => c.id === id);

  if (!comment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  return toCommentResponseDto(comment);
}

export function createComment(body: unknown): CommentResponseDto {
  const dto = body as CreateCommentRequestDto;
  const errors = validateComment(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const comment: CommentEntity = {
    id: (Date.now() + 1).toString(),
    text: dto.text,
    postId: dto.postId,
    userId: dto.userId
  };

  comments.push(comment);

  return toCommentResponseDto(comment);
}

export function updateComment(id: string, body: unknown): CommentResponseDto {
  const comment = comments.find((c) => c.id === id);

  if (!comment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  const dto = body as UpdateCommentRequestDto;
  const errors = validateComment(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  comment.text = dto.text;
  comment.postId = dto.postId;
  comment.userId = dto.userId;

  return toCommentResponseDto(comment);
}

export function deleteComment(id: string): void {
  const index = comments.findIndex((c) => c.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  comments.splice(index, 1);
}