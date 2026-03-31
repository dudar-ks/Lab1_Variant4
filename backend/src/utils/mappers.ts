import type { User } from "../types/user.types";
import type { Post } from "../types/post.types";
import type { CommentEntity } from "../types/comment.types";
import type { UserResponseDto } from "../dtos/users.dto";
import type { PostResponseDto } from "../dtos/posts.dto";
import type { CommentResponseDto } from "../dtos/comments.dto";

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

export function toPostResponseDto(post: Post): PostResponseDto {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    body: post.body,
    author: post.author,
    createdAt: post.createdAt,
  };
}

export function toCommentResponseDto(
  comment: CommentEntity
): CommentResponseDto {
  return {
    id: comment.id,
    text: comment.text,
    postId: comment.postId,
    userId: comment.userId,
  };
}