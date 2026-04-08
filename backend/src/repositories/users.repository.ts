import { all, get, run } from "../db/db";

export async function getUsers(params: {
  email?: string;
  sort?: string;
  order?: string;
}) {
  const { email, sort, order } = params;

  let sql = `
    SELECT id, name, email, createdAt
    FROM Users
  `;

  const conditions: string[] = [];

  if (email) {
    const safeEmail = email.replace(/'/g, "''");
    conditions.push(`email = '${safeEmail}'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const allowedSort = ["id", "name", "email", "createdAt"];
  const sortField = allowedSort.includes(sort || "") ? sort : "id";
  const sortOrder = order === "desc" ? "DESC" : "ASC";

  sql += ` ORDER BY ${sortField} ${sortOrder};`;

  return await all(sql);
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

  const safeName = name.replace(/'/g, "''");
  const safeEmail = email.replace(/'/g, "''");

  const result = await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('${safeName}', '${safeEmail}', '${now}');
  `);

  return await getUserById(result.lastID);
}

export async function updateUser(id: number, name: string, email: string) {
  const safeName = name.replace(/'/g, "''");
  const safeEmail = email.replace(/'/g, "''");

  const result = await run(`
    UPDATE Users
    SET name = '${safeName}', email = '${safeEmail}'
    WHERE id = ${id};
  `);

  if (result.changes === 0) {
    return null;
  }

  return await getUserById(id);
}

export async function deleteUser(id: number) {
  const result = await run(`
    DELETE FROM Users
    WHERE id = ${id};
  `);

  return result.changes > 0;
}