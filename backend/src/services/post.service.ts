        import ApiError from "../errors/ApiError";
    import { toPostResponseDto, toPostWithAuthorResponse } from "../utils/mappers";
    import { validateCreatePostDto, validateUpdatePostDto } from "../utils/validators";
    import type { CreatePostRequestDto, UpdatePostRequestDto } from "../dtos/posts.dto";
    import * as postsRepository from "../repositories/posts.repository";

    
    type GetPostsOptions = {
      userId?: number;
      category?: string;
      author?: string;
      sort?: string;
      order?: string;
    };
    
    export async function getPosts(options: GetPostsOptions = {}) {
      const posts = await postsRepository.getPosts(options);
    
      return {
        items: posts.map(toPostResponseDto),
        total: posts.length
      };
    }
    
    export async function getPostById(id: number) {
      const post = await postsRepository.getPostById(id);
    
      if (!post) {
        throw new ApiError(404, "NOT_FOUND", "Post not found");
      }
    
      return toPostResponseDto(post);
    }
    
    export async function createPost(dto: CreatePostRequestDto) {
      const errors = validateCreatePostDto(dto);
    
      if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
      }
    
    try {
        const createdPost = await postsRepository.createPost(
          dto.title.trim(),
          dto.category.trim(),
          dto.body.trim(),
          dto.author.trim(),
          Number(dto.userId)
        );
    
        return toPostResponseDto(createdPost);
      } catch (error: unknown) {
        const message = String((error as { message?: string })?.message || "");
    
        if (message.includes("FOREIGN KEY constraint failed")) {
          throw new ApiError(400, "VALIDATION_ERROR", "Invalid userId", [
            { field: "userId", message: "Referenced user does not exist" }
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
    
    export async function updatePost(id: number, dto: UpdatePostRequestDto) {
      const existingPost = await postsRepository.getPostById(id);
    
      if (!existingPost) {
        throw new ApiError(404, "NOT_FOUND", "Post not found");
      }
    
      const errors = validateUpdatePostDto(dto);
    
      if (errors.length > 0) {
        throw new ApiError(400, "VALIDATION_ERROR", "Invalid request body", errors);
      }
    
      try {
        const updatedPost = await postsRepository.updatePost(
          id,
          dto.title.trim(),
          dto.category.trim(),
          dto.body.trim(),
          dto.author.trim(),
          Number(dto.userId)
        );
    
        if (!updatedPost) {
          throw new ApiError(404, "NOT_FOUND", "Post not found");
        }
    
        return toPostResponseDto(updatedPost);
      } catch (error: unknown) {
        const message = String((error as { message?: string })?.message || "");
    
        if (message.includes("FOREIGN KEY constraint failed")) {
          throw new ApiError(400, "VALIDATION_ERROR", "Invalid userId", [
            { field: "userId", message: "Referenced user does not exist" }
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
    
    export async function deletePost(id: number): Promise<void> {
      const existingPost = await postsRepository.getPostById(id);
    
      if (!existingPost) {
        throw new ApiError(404, "NOT_FOUND", "Post not found");
      }
    
      const deleted = await postsRepository.deletePost(id);
    
      if (!deleted) {
        throw new ApiError(404, "NOT_FOUND", "Post not found");
      }
    }
    
    export async function getPostWithAuthor(id: number) {
      const post = await postsRepository.getPostWithAuthor(id);
    
      if (!post) {
        throw new ApiError(404, "NOT_FOUND", "Post not found");
      }
    
      return toPostWithAuthorResponse(post);
    }
    
    export async function getPostStats() {
      const stats = await postsRepository.getPostStats();
      return {
        totalPosts: Number(stats?.totalPosts ?? 0),
        avgTitleLength: Number(stats?.avgTitleLength ?? 0)
      };
    }
    export async function getTopCommentedPostWithTopUsers () {
      const items = await postsRepository.getTopCommentedPostsWithTopUsers();
      return {items, total: items.length};
    }

export async function getPostsCount() {
  const count = await postsRepository.countPosts();
  return count;
}
