export type CreatePostRequestDto = {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
};

export type UpdatePostRequestDto = {
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
};

export type PostResponseDto = {
  id: number;
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
  createdAt: string;
};