import { NextFunction, Request, Response } from "express";
import * as postService from "../services/post.service";
import ApiError from "../errors/ApiError";
import type {
  CreatePostRequestDto,
  UpdatePostRequestDto,
} from "../dtos/posts.dto";

export async function getPosts(
  _req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const result = await postService.getPosts();

    return res.status(200).json({
      items: result.items,
      total: result.total,
    });
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
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const post = await postService.getPostById(id);

    return res.status(200).json({
      item: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function createPost(
  req: Request<{}, {}, CreatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const { title, category, body, author, userId } = req.body;

    if (!title || !category || !body || !author || userId === undefined) {
      throw new ApiError(400, "VALIDATION_ERROR", "Required fields are missing", [
        { field: "title", message: "Title is required" },
        { field: "category", message: "Category is required" },
        { field: "body", message: "Body is required" },
        { field: "author", message: "Author is required" },
        { field: "userId", message: "UserId is required" },
      ]);
    }

    const post = await postService.createPost(req.body);

    return res.status(201).json({
      item: post,
    });
  } catch (error) {
    next(error);
  }
}

export async function updatePost(
  req: Request<{ id: string }, {}, UpdatePostRequestDto>,
  res: Response,
  next: NextFunction
) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      throw new ApiError(400, "VALIDATION_ERROR", "Post id must be a valid number", [
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    const post = await postService.updatePost(id, req.body);

    return res.status(200).json({
      item: post,
    });
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
        { field: "id", message: "Id must be a valid number" },
      ]);
    }

    await postService.deletePost(id);

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
}