import { all, get, run } from "../db/dbClient";

export async function getUsers() {
  return await all(`
    SELECT id, name, email, createdAt
    FROM Users
    ORDER BY id DESC;
  `);
}

export async function getUserById(id: number) {
  return await get(`
    SELECT id, name, email, createdAt
    FROM Users
    WHERE id = ${id};
  `);
}

export async function createUser(name: string, email: string) {
  const now = new Date().toISOString();

  const result = await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('${name}', '${email}', '${now}');
  `);

  return await getUserById(result.lastID);
}