export type CreatePostRequestDto = {
  title: string;
  category: string;
  body: string;
  author: string;
};

export type UpdatePostRequestDto = {
  title: string;
  category: string;
  body: string;
  author: string;
};

export type PostResponseDto = {
  id: number;
  title: string;
  category: string;
  body: string;
  author: string;
  createdAt: string;
};