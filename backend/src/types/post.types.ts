export type PostEntity = {
  id: number;
  title: string;
  category: string;
  body: string;
  author: string;
  userId: number;
  createdAt: string;
};

export type PostWithAuthorEntity = PostEntity & {
  userName: string;
  userEmail: string;
};