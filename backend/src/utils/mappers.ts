import { User } from "../types/user.types.js";
import { Post } from "../types/post.types.js";
import { CommentEntity } from "../types/comment.types.js";

import { UserResponseDto } from "../dtos/users.dto.js";
import { PostResponseDto } from "../dtos/posts.dto.js";
import { CommentResponseDto } from "../dtos/comments.dto.js";

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

export function toCommentResponseDto(comment: CommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    text: comment.text,
    postId: comment.postId,
    userId: comment.userId,
  };
}