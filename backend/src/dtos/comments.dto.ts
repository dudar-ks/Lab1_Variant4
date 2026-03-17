export type CreateCommentRequestDto = {
  text: string;
  postId: string;
  userId: string;
};

export type UpdateCommentRequestDto = {
  text: string;
  postId: string;
  userId: string;
};

export type CommentResponseDto = {
  id: string;
  text: string;
  postId: string;
  userId: string;
};