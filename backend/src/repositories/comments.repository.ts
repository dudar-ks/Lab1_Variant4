import { all, get, run } from "../db/db";

type GetCommentsParams = {
  postId?: number;
  userId?: number;
  sort?: string;
  order?: string;
};

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

export async function getComments(params: GetCommentsParams = {}) {
  const { postId, userId, sort, order } = params;

  let sql = `
    SELECT id, text, postId, userId, createdAt
    FROM Comments
  `;

  const conditions: string[] = [];

  if (typeof postId === "number" && Number.isFinite(postId)) {
    conditions.push(`postId = ${postId}`);
  }

  if (typeof userId === "number" && Number.isFinite(userId)) {
    conditions.push(`userId = ${userId}`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const allowedSortFields = ["id", "createdAt", "postId", "userId"];
  const sortField = allowedSortFields.includes(sort || "") ? sort : "id";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  sql += ` ORDER BY ${sortField} ${sortOrder};`;

  return await all(sql);
}

export async function getCommentById(id: number) {
  return await get(`
    SELECT id, text, postId, userId, createdAt
    FROM Comments
    WHERE id = ${id};
  `);
}

export async function createComment(
  text: string,
  postId: number,
  userId: number
) {
  const now = new Date().toISOString();
  const safeText = escapeSqlString(text);

  const result = await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('${safeText}', ${postId}, ${userId}, '${now}');
  `);

  return await getCommentById(result.lastID);
}

export async function updateComment(id: number, text: string) {
  const safeText = escapeSqlString(text);

  const result = await run(`
    UPDATE Comments
    SET text = '${safeText}'
    WHERE id = ${id};
  `);

  if (result.changes === 0) {
    return null;
  }

  return await getCommentById(id);
}

export async function deleteComment(id: number) {
  const result = await run(`
    DELETE FROM Comments
    WHERE id = ${id};
  `);

  return result.changes > 0;
}

export async function getCommentsByPost(postId: number) {
  return await all(`
    SELECT id, text, postId, userId, createdAt
    FROM Comments
    WHERE postId = ${postId}
    ORDER BY id DESC;
  `);
}

export async function getCommentsWithUsers(postId: number) {
  return await all(`
    SELECT
      c.id,
      c.text,
      c.postId,
      c.createdAt,
      u.id AS userId,
      u.name AS userName,
      u.email AS userEmail
    FROM Comments c
    JOIN Users u ON c.userId = u.id
    WHERE c.postId = ${postId}
    ORDER BY c.id DESC;
  `);
}