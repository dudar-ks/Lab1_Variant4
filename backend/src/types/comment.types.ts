export type CommentEntity = {
  id: number;
  text: string;
  postId: number;
  userId: number;
  createdAt: string;
};

export type CommentWithUserEntity = CommentEntity & {
  userName: string;
  userEmail: string;
};