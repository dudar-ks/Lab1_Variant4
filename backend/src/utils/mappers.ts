import type { User } from "../types/user.types";
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

export function toPostResponseDto(post: {
  id: number;
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
  createdAt: string;
}) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    body: post.body,
    author: post.author,
    userId: post.userId,
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