import { all, get, run } from "../db/db";
import type { PostEntity } from "../types/post.types";

type GetPostsOptions = {
  category?: string;
  author?: string;
  userId?: number;
  sort?: string;
  order?: string;
};

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

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

  sql += ` ORDER BY ${sortField} ${sortOrder};`;

  return await all<PostEntity>(sql);
}

export async function getPostById(
  id: number
): Promise<PostEntity | undefined> {
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

  const updatedPost = await getPostById(id);
  return updatedPost ?? null;
}

export async function deletePost(id: number): Promise<boolean> {
  const result = await run(`
    DELETE FROM Posts
    WHERE id = ${id};
  `);

  return result.changes > 0;
}

export async function getPostsWithAuthors() {
  return await all<{
    id: number;
    title: string;
    category: string;
    body: string;
    author: string;
    userId: number;
    createdAt: string;
    userName: string;
    userEmail: string;
  }>(`
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
    ORDER BY p.id DESC;
  `);
}