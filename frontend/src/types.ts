export type ViewName = "posts" | "users" | "comments";

export interface UserDto {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface PostDto {
  id: number;
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
  createdAt: string;
}

export interface CommentDto {
  id: number;
  text: string;
  postId: number;
  userId: number;
  createdAt: string;
}

export interface PostWithAuthorDto extends PostDto {
  authorData: {
    name: string;
    email: string;
  };
}

export interface CommentWithUserDto extends CommentDto {
  user: {
    name: string;
    email: string;
  };
}

export interface CreatePostDto {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
}

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface CreateCommentDto {
  text: string;
  postId: number;
  userId: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
  errors?: {
    field: string;
    message: string;
  }[];
}