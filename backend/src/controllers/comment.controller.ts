import { NextFunction, Request, Response } from "express";
import * as commentService from "../services/comment.service";

export async function getComments(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await commentService.getComments({
      postId:
        typeof req.query.postId === "string" ? Number(req.query.postId) : undefined,
      userId:
        typeof req.query.userId === "string" ? Number(req.query.userId) : undefined,
      sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
      order: typeof req.query.order === "string" ? req.query.order : undefined,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCommentById(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await commentService.getCommentById(Number(req.params.id));
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await commentService.createComment(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await commentService.updateComment(Number(req.params.id), req.body);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    await commentService.deleteComment(Number(req.params.id));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}