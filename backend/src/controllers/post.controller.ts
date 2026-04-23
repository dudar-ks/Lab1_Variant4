import { NextFunction, Request, Response } from "express";
import ApiError from "../errors/ApiError";
import * as postService from "../services/post.service";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto
} from "../dtos/posts.dto";

export async function getPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const userId =
      typeof req.query.userId === "string" ? Number(req.query.userId) : undefined;

    const result = await postService.getPosts({
      userId: userId !== undefined && !Number.isNaN(userId) ? userId : undefined,
      category:
        typeof req.query.category === "string" ? req.query.category : undefined,
      author: typeof req.query.author === "string" ? req.query.author : undefined,
      sort: typeof req.query.sort === "string" ? req.query.sort : undefined,
      order:
        req.query.order === "asc" || req.query.order === "desc"
          ? req.query.order
          : undefined
    });

    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getPostById(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Post id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    const post = await postService.getPostById(id);
    return res.status(200).json({ item: post });
  } catch (error) {
    next(error);
  }
}

export async function createPost(
  req: Request<Record<string, never>, Record<string, never>, CreatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const post = await postService.createPost(req.body);
    return res.status(201).json({ item: post });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(
  req: Request<{ id: string }, Record<string, never>, UpdatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Post id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    const post = await postService.updatePost(id, req.body);
    return res.status(200).json({ item: post });
  } catch (error) {
    next(error);
  }
}

export async function deletePost(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Post id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    await postService.deletePost(id);
    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function getPostWithAuthor(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Post id must be a valid number", [
        { field: "id", message: "Id must be a valid number" }
      ]);
    }

    const post = await postService.getPostWithAuthor(id);
    return res.status(200).json({ item: post });
  } catch (error) {
    next(error);
  }
}

export async function getPostStats(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const stats = await postService.getPostStats();
    return res.status(200).json({ item: stats });
  } catch (error) {
    next(error);
  }
}
export async function getTopCommentedPostsWithTopUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await postService.getTopCommentedPostWithTopUsers();
    return res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
export async function getPostsCount(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const count = await postService.getPostsCount();
    return res.status(200).json({ count });
  } catch (error) {
    next(error);
  }
}
