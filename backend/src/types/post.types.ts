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

export type TopCommentedPostWithTopUsersEnity = {
postId:number;
title: string;
totalComments: number;
TopUserId: number;
TopUserName: string;
TopUserEmail:string;
UserCommentsCount: number;
}