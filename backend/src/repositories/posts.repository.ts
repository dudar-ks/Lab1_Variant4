import { all, get, run } from "../db/db";

type GetPostsParams = {
  userId?: number;
  category?: string;
  sort?: string;
  order?: string;
};

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

export async function getPosts(params: GetPostsParams = {}) {
  const { userId, category, sort, order } = params;

  let sql = `
    SELECT id, title, category, body, author, userId, createdAt
    FROM Posts
  `;

  const conditions: string[] = [];

  if (typeof userId === "number" && Number.isFinite(userId)) {
    conditions.push(`userId = ${userId}`);
  }

  if (category) {
    conditions.push(`category = '${escapeSqlString(category)}'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const allowedSortFields = ["id", "title", "category", "createdAt", "userId"];
  const sortField = allowedSortFields.includes(sort || "") ? sort : "id";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  sql += ` ORDER BY ${sortField} ${sortOrder};`;

  return await all(sql);
}

export async function getPostById(id: number) {
  return await get(`
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
) {
  const now = new Date().toISOString();

  const safeTitle = escapeSqlString(title);
  const safeCategory = escapeSqlString(category);
  const safeBody = escapeSqlString(body);
  const safeAuthor = escapeSqlString(author);

  const result = await run(`
    INSERT INTO Posts (title, category, body, author, userId, createdAt)
    VALUES ('${safeTitle}', '${safeCategory}', '${safeBody}', '${safeAuthor}', ${userId}, '${now}');
  `);

  return await getPostById(result.lastID);
}

export async function updatePost(
  id: number,
  title: string,
  category: string,
  body: string,
  author: string,
  userId: number
) {
  const safeTitle = escapeSqlString(title);
  const safeCategory = escapeSqlString(category);
  const safeBody = escapeSqlString(body);
  const safeAuthor = escapeSqlString(author);

  const result = await run(`
    UPDATE Posts
    SET
      title = '${safeTitle}',
      category = '${safeCategory}',
      body = '${safeBody}',
      author = '${safeAuthor}',
      userId = ${userId}
    WHERE id = ${id};
  `);

  if (result.changes === 0) {
    return null;
  }

  return await getPostById(id);
}

export async function deletePost(id: number) {
  const result = await run(`
    DELETE FROM Posts
    WHERE id = ${id};
  `);

  return result.changes > 0;
}

export async function getPostsByUser(userId: number) {
  return await all(`
    SELECT id, title, category, body, author, userId, createdAt
    FROM Posts
    WHERE userId = ${userId}
    ORDER BY id DESC
    LIMIT 5;
  `);
}

export async function getPostWithAuthor(postId: number) {
  return await get(`
    SELECT
      p.id,
      p.title,
      p.category,
      p.body,
      p.author,
      p.userId,
      p.createdAt,
      u.id AS authorId,
      u.name AS authorName,
      u.email AS authorEmail
    FROM Posts p
    JOIN Users u ON p.userId = u.id
    WHERE p.id = ${postId};
  `);
}