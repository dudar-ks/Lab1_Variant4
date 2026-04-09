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
import * as commentsRepository from "../repositories/comments.repository";

type GetCommentsOptions = {
  postId?: number;
  userId?: number;
  sort?: string;
  order?: string;
};

export async function getComments(options: GetCommentsOptions = {}) {
  const comments = await commentsRepository.getComments({
    postId: options.postId,
    userId: options.userId,
    sort: options.sort,
    order: options.order,
  });

  return {
    items: comments.map(toCommentResponseDto),
    total: comments.length,
  };
}

export async function getCommentById(id: number) {
  const comment = await commentsRepository.getCommentById(id);

  if (!comment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  return toCommentResponseDto(comment);
}

export async function createComment(dto: CreateCommentRequestDto) {
  const errors = validateCreateCommentDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  try {
    const createdComment = await commentsRepository.createComment(
      dto.text.trim(),
      Number(dto.postId),
      Number(dto.userId)
    );

    return toCommentResponseDto(createdComment);
  } catch (error: any) {
    const message = String(error?.message || "");

    if (message.includes("FOREIGN KEY constraint failed")) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid postId or userId", [
        { field: "postId", message: "Referenced post may not exist" },
        { field: "userId", message: "Referenced user may not exist" },
      ]);
    }

    if (
      message.includes("NOT NULL constraint failed") ||
      message.includes("CHECK constraint failed")
    ) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body");
    }

    throw error;
  }
}

export async function updateComment(id: number, dto: UpdateCommentRequestDto) {
  const existingComment = await commentsRepository.getCommentById(id);

  if (!existingComment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  const errors = validateUpdateCommentDto(dto);

  if (errors.length > 0) {
    throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
  }

  try {
    const updatedComment = await commentsRepository.updateComment(
      id,
      dto.text.trim(),
      Number(dto.postId),
      Number(dto.userId)
    );

    if (!updatedComment) {
      throw new ApiError(404, "NOT_FOUND", "Comment not found");
    }

    return toCommentResponseDto(updatedComment);
  } catch (error: any) {
    const message = String(error?.message || "");

    if (message.includes("FOREIGN KEY constraint failed")) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid postId or userId", [
        { field: "postId", message: "Referenced post may not exist" },
        { field: "userId", message: "Referenced user may not exist" },
      ]);
    }

    if (
      message.includes("NOT NULL constraint failed") ||
      message.includes("CHECK constraint failed")
    ) {
      throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body");
    }

    throw error;
  }
}

export async function deleteComment(id: number) {
  const existingComment = await commentsRepository.getCommentById(id);

  if (!existingComment) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }

  const deleted = await commentsRepository.deleteComment(id);

  if (!deleted) {
    throw new ApiError(404, "NOT_FOUND", "Comment not found");
  }
}

export async function getCommentsWithUsers(postId: number) {
  return await commentsRepository.getCommentsWithUsers(postId);
}