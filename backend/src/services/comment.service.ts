import { comments } from "../repositories/comments.repository";
import ApiError from "../errors/ApiError";
import { toCommentResponseDto } from "../utils/mappers";
import {
  validateCreateCommentDto,
  validateUpdateCommentDto,
} from "../utils/validators";
import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from "../dtos/comments.dto";
import type { CommentEntity } from "../types/comment.types";

function getNextCommentId(): number {
  if (comments.length === 0) {
    return 1;
  }

  return Math.max(...comments.map((comment) => comment.id)) + 1;
}

export function getComments() {
  return {
    items: comments.map(toCommentResponseDto),
    total: comments.length,
  };
}

export function getCommentById(id: number) {
  const comment = comments.find((item) => item.id === id);

  if (!comment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  return toCommentResponseDto(comment);
}

export function createComment(dto: CreateCommentRequestDto) {
  const errors = validateCreateCommentDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  const newComment: CommentEntity = {
    id: getNextCommentId(),
    text: dto.text.trim(),
    postId: dto.postId,
    userId: dto.userId,
  };

  comments.push(newComment);

  return toCommentResponseDto(newComment);
}

export function updateComment(id: number, dto: UpdateCommentRequestDto) {
  const comment = comments.find((item) => item.id === id);

  if (!comment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  const errors = validateUpdateCommentDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  comment.text = dto.text.trim();
  comment.postId = dto.postId;
  comment.userId = dto.userId;

  return toCommentResponseDto(comment);
}

export function deleteComment(id: number) {
  const index = comments.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  comments.splice(index, 1);
}