  import { all, get, run } from "../db/db";
  import type { PostEntity, PostWithAuthorEntity, TopCommentedPostWithTopUsersEnity } from "../types/post.types";
  import { escapeSqlString } from "../utils/sql.ts";

  type GetPostsOptions = {
    category?: string;
    author?: string;
    userId?: number;
    sort?: string;
    order?: string;
  };

  export async function getPosts(
    options: GetPostsOptions = {}
  ): Promise<PostEntity[]> {
    let sql = `
      SELECT id, title, category, body, author, userId, createdAt
      FROM Posts
    `;

    const conditions: string[] = [];

    if (options.category) {
      conditions.push(`category = '${escapeSqlString(options.category)}'`);
    }

    if (options.author) {
      conditions.push(`author LIKE '%${escapeSqlString(options.author)}%'`);
    }

    if (typeof options.userId === "number" && Number.isFinite(options.userId)) {
      conditions.push(`userId = ${options.userId}`);
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(" AND ")}`;
    }

    const allowedSortFields = ["id", "createdAt", "title", "category"];
    const sortField = allowedSortFields.includes(options.sort || "")
      ? options.sort
      : "id";
    const sortOrder = options.order === "asc" ? "ASC" : "DESC";

    sql += ` ORDER BY ${sortField} ${sortOrder} LIMIT 100;`;

    return await all<PostEntity>(sql);
  }

  export async function getPostById(id: number): Promise<PostEntity | undefined> {
    return await get<PostEntity>(`
      SELECT id, title, category, body, author, userId, createdAt
      FROM Posts
      WHERE id = ${id};
    `);
  }

  export async function createPost(
    title: string,
    category: string,
    body: string,
    author: string,
    userId: number
  ): Promise<PostEntity> {
    const result = await run(`
      INSERT INTO Posts (title, category, body, author, userId, createdAt)
      VALUES (
        '${escapeSqlString(title)}',
        '${escapeSqlString(category)}',
        '${escapeSqlString(body)}',
        '${escapeSqlString(author)}',
        ${userId},
        '${new Date().toISOString()}'
      );
    `);
    console.log("RUN RESULT:", result);
    
    const createdPost = await getPostById(result.lastID);

    if (!createdPost) {
      throw new Error("Failed to fetch created post");
    }

    return createdPost;
  }

  export async function updatePost(
    id: number,
    title: string,
    category: string,
    body: string,
    author: string,
    userId: number
  ): Promise<PostEntity | null> {
    const result = await run(`
      UPDATE Posts
      SET
        title = '${escapeSqlString(title)}',
        category = '${escapeSqlString(category)}',
        body = '${escapeSqlString(body)}',
        author = '${escapeSqlString(author)}',
        userId = ${userId}
      WHERE id = ${id};
    `);

    if (result.changes === 0) {
      return null;
    }

    return (await getPostById(id)) ?? null;
  }

  export async function deletePost(id: number): Promise<boolean> {
    const result = await run(`DELETE FROM Posts WHERE id = ${id};`);
    return result.changes > 0;
  }

  export async function getPostWithAuthor(
    id: number
  ): Promise<PostWithAuthorEntity | undefined> {
    return await get<PostWithAuthorEntity>(`
      SELECT
        p.id,
        p.title,
        p.category,
        p.body,
        p.author,
        p.userId,
        p.createdAt,
        u.name AS userName,
        u.email AS userEmail
      FROM Posts p
      JOIN Users u ON p.userId = u.id
      WHERE p.id = ${id};
    `);
  }

  export async function getPostStats(): Promise<{
    totalPosts: number;
    avgTitleLength: number;
  } | undefined> {
    return await get(`
      SELECT
        COUNT(*) AS totalPosts,
        AVG(LENGTH(title)) AS avgTitleLength
      FROM Posts;
    `);
  }
  export async function getTopCommentedPostsWithTopUsers(): Promise<
    TopCommentedPostWithTopUsersEnity[]
  > {
    const posts = await all<{
      postId: number;
      title: string;
      totalComments: number;
    }>(`
      SELECT
        p.id AS postId,
        p.title AS title,
        COUNT(c.id) AS totalComments
      FROM Posts p
      JOIN Comments c ON p.id = c.postId
      GROUP BY p.id, p.title
      ORDER BY totalComments DESC, p.id ASC
      LIMIT 3;
    `);

    const result: TopCommentedPostWithTopUsersEnity[] = [];

    for (const post of posts) {
      const userResult = await get<{
        TopUserId: number;
        TopUserName: string;
        TopUserEmail: string;
        UserCommentsCount: number;
      }>(`
        SELECT
          u.id AS TopUserId,
          u.name AS TopUserName,
          u.email AS TopUserEmail,
          COUNT(c.id) AS UserCommentsCount
        FROM Comments c
      JOIN Users u ON c.userId = u.id
        WHERE c.postId = ${post.postId}
        GROUP BY u.id, u.name, u.email
        ORDER BY UserCommentsCount DESC, u.id ASC
        LIMIT 1;
      `);

      if (userResult) {
        result.push({
          postId: post.postId,
          title: post.title,
          totalComments: post.totalComments,
          TopUserId: userResult.TopUserId,
          TopUserName: userResult.TopUserName,
          TopUserEmail: userResult.TopUserEmail,
          UserCommentsCount: userResult.UserCommentsCount,
        });
      }
    }

    return result;
  }

  export function countPosts() {
    throw new Error("Function not implemented.");
  }

