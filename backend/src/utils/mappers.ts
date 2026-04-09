import type { UserEntity } from "../types/user.types";
import type { PostEntity, PostWithAuthorEntity } from "../types/post.types";
import type { CommentEntity, CommentWithUserEntity } from "../types/comment.types";
import type { UserResponseDto } from "../dtos/users.dto";
import type { PostResponseDto } from "../dtos/posts.dto";
import type { CommentResponseDto } from "../dtos/comments.dto";

export function toUserResponseDto(user: UserEntity): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}

export function toPostResponseDto(post: PostEntity): PostResponseDto {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    body: post.body,
    author: post.author,
    userId: post.userId,
    createdAt: post.createdAt
  };
}

export function toCommentResponseDto(comment: CommentEntity): CommentResponseDto {
  return {
    id: comment.id,
    text: comment.text,
    postId: comment.postId,
    userId: comment.userId,
    createdAt: comment.createdAt
  };
}

export function toPostWithAuthorResponse(post: PostWithAuthorEntity) {
  return {
    id: post.id,
    title: post.title,
    category: post.category,
    body: post.body,
    author: post.author,
    userId: post.userId,
    createdAt: post.createdAt,
    authorData: {
      name: post.userName,
      email: post.userEmail
    }
  };
}

export function toCommentWithUserResponse(comment: CommentWithUserEntity) {
  return {
    id: comment.id,
    text: comment.text,
    postId: comment.postId,
    userId: comment.userId,
    createdAt: comment.createdAt,
    user: {
      name: comment.userName,
      email: comment.userEmail
    }
  };
}