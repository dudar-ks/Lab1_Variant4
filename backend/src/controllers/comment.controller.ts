import { NextFunction, Request, Response } from "express";
import * as commentService from "../services/comment.service";
import ApiError from "../errors/ApiError";
import type {
  CreateCommentRequestDto,
  UpdateCommentRequestDto,
} from "../dtos/comments.dto";

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const postId =
      typeof req.query.postId === "string" ? Number(req.query.postId) : undefined;

    const userId =
      typeof req.query.userId === "string" ? Number(req.query.userId) : undefined;

    const result = await commentService.getComments({
      postId: postId !== undefined && !Number.isNaN(postId) ? postId : undefined,
      userId: userId !== undefined && !Number.isNaN(userId) ? userId : undefined,
      sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined,
    });

    return res.status(200).json({
      items: result.items,
      total: result.total,
    });
  } catch (error) {
    next(error);
  }
}

export async function getCommentById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Comment id must be a valid number",
        [{ field: "id", message: "Id must be a valid number" }]
      );
    }

    const comment = await commentService.getCommentById(id);

    return res.status(200).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: Request<{}, {}, CreateCommentRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = await commentService.createComment(req.body);

    return res.status(201).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  req: Request<{ id: string }, {}, UpdateCommentRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Comment id must be a valid number",
        [{ field: "id", message: "Id must be a valid number" }]
      );
    }

    const comment = await commentService.updateComment(id, req.body);

    return res.status(200).json({
      item: comment,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Comment id must be a valid number",
        [{ field: "id", message: "Id must be a valid number" }]
      );
    }

    await commentService.deleteComment(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getCommentsWithUsers(
  req: Request<{ postId: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const postId = Number(req.params.postId);

    if (Number.isNaN(postId)) {
      throw new ApiError(
        400,
        "VALIDATION_ERROR",
        "Post id must be a valid number",
        [{ field: "postId", message: "Post id must be a valid number" }]
      );
    }

    const items = await commentService.getCommentsWithUsers(postId);

    return res.status(200).json({
      items,
    });
  } catch (error) {
    next(error);
  }
}