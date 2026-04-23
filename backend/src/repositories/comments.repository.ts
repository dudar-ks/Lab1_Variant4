import { all, get, run } from "../db/db";
import type {
  CommentEntity,
  CommentWithUserEntity
} from "../types/comment.types";
import { escapeSqlString } from "../utils/sql.ts";

type GetCommentsParams = {
  postId?: number;
  userId?: number;
  sort?: string;
  order?: string;
};

export async function getComments(
  params: GetCommentsParams = {}
): Promise<CommentEntity[]> {
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

  sql += ` ORDER BY ${sortField} ${sortOrder} LIMIT 100;`;

  return await all<CommentEntity>(sql);
}

export async function getCommentById(
  id: number
): Promise<CommentEntity | undefined> {
  return await get<CommentEntity>(`
    SELECT id, text, postId, userId, createdAt
    FROM Comments
    WHERE id = ${id};
  `);
}

export async function createComment(
  text: string,
  postId: number,
  userId: number
): Promise<CommentEntity> {
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('${escapeSqlString(text)}', ${postId}, ${userId}, '${now}');
  `);

  const createdComment = await getCommentById(result.lastID);

  if (!createdComment) {
    throw new Error("Failed to fetch created comment");
  }

  return createdComment;
}

export async function updateComment(
  id: number,
  text: string,
  postId: number,
  userId: number
): Promise<CommentEntity | null> {
  const result = await run(`
    UPDATE Comments
    SET text = '${escapeSqlString(text)}', postId = ${postId}, userId = ${userId}
    WHERE id = ${id};
  `);

  if (result.changes === 0) {
    return null;
  }

  return (await getCommentById(id)) ?? null;
}

export async function deleteComment(id: number): Promise<boolean> {
  const result = await run(`DELETE FROM Comments WHERE id = ${id};`);
  return result.changes > 0;
}

export async function getCommentsWithUsers(
  postId: number
): Promise<CommentWithUserEntity[]> {
  return await all<CommentWithUserEntity>(`
    SELECT
      c.id,
      c.text,
      c.postId,
      c.userId,
      c.createdAt,
      u.name AS userName,
      u.email AS userEmail
    FROM Comments c
    JOIN Users u ON c.userId = u.id
    WHERE c.postId = ${postId}
    ORDER BY c.id DESC;
  `);
}
