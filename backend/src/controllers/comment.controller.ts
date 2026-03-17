import { Request, Response, NextFunction } from "express";
import * as commentService from "../services/comment.service.js";

export function getComments(req: Request, res: Response, next: NextFunction) {
  try {
    const comments = commentService.getComments();
    res.status(200).json(comments);
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
    const comment = commentService.getCommentById(req.params.id);
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
}

export function createComment(req: Request, res: Response, next: NextFunction) {
  try {
    const comment = commentService.createComment(req.body);
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
}

export function updateComment(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const comment = commentService.updateComment(req.params.id, req.body);
    res.status(200).json(comment);
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
    commentService.deleteComment(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}