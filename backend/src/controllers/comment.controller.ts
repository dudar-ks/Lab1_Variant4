import { NextFunction, Request, Response } from "express";
import * as commentService from "../services/comment.service";
import ApiError from "../errors/ApiError";
import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from "../dtos/comments.dto";

export function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const result = commentService.getComments();

    return res.status(200).json({
      items: result.items,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export function getCommentById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Comment id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const comment = commentService.getCommentById(id);

    return res.status(200).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export function createComment(
  req: Request<{}, {}, CreateCommentRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = commentService.createComment(req.body);

    return res.status(201).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export function updateComment(
  req: Request<{ id: string }, {}, UpdateCommentRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Comment id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const comment = commentService.updateComment(id, req.body);

    return res.status(200).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export function deleteComment(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Comment id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    commentService.deleteComment(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}