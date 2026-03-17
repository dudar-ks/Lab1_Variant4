import { Request, Response, NextFunction } from "express";
import * as postService from "../services/post.service.js";

export function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = postService.getPosts();
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

export function getPostById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const post = postService.getPostById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export function createPost(req: Request, res: Response, next: NextFunction) {
  try {
    const post = postService.createPost(req.body);
    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
}

export function updatePost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const post = postService.updatePost(req.params.id, req.body);
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

export function deletePost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    postService.deletePost(req.params.id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}