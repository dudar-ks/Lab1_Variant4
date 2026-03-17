import { Request, Response, NextFunction } from "express";
import * as postService from "../services/post.service";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "../dtos/posts.dto";

export function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const posts = postService.getPosts();
    
    return res.status(200).json({
      items: posts,
      total: posts.length,
    });
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

    return res.status(200).json({
      item: post,
    });
  } catch (error) {
    next(error);
  }
}

export function createPost(
  req: Request<{}, {}, CreatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const post = postService.createPost(req.body);

    return res.status(201).json({
      item: post,
    });
  } catch (error) {
    next(error);
  }
}

export function updatePost(
  req: Request<{ id: string }, {}, UpdatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const post = postService.updatePost(req.params.id, req.body);

    return res.status(200).json({
      item: post,
    });
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

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}