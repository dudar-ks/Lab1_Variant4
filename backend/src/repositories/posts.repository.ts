import { all, get, run } from "../db/dbClient";

export async function getPosts() {
  return await all(`
    SELECT id, title, category, body, author, userId, createdAt
    FROM Posts
    ORDER BY id DESC;
  `);
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

  const result = await run(`
    INSERT INTO Posts (title, category, body, author, userId, createdAt)
    VALUES ('${title}', '${category}', '${body}', '${author}', ${userId}, '${now}');
  `);

  return await getPostById(result.lastID);
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