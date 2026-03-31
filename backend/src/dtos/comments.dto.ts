export type CreateCommentRequestDto = {
  text: string;
  postId: number;
  userId: number;
};

export type UpdateCommentRequestDto = {
  text: string;
  postId: number;
  userId: number;
};

export type CommentResponseDto = {
  id: number;
  text: string;
  postId: number;
  userId: number;
};