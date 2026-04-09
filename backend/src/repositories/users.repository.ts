import { all, get, run } from "../db/db";
import type { User } from "../types/user.types";

type GetUsersOptions = {
  name?: string;
  email?: string;
  sortBy?: "id" | "name" | "email";
  sortDir?: "asc" | "desc";
};

function escapeSqlString(value: string): string {
  return String(value).replace(/'/g, "''");
}

export async function getUsers(
  options: GetUsersOptions = {}
): Promise<User[]> {
  let sql = `SELECT id, name, email FROM Users`;

  const conditions: string[] = [];

  if (options.name) {
    conditions.push(`name LIKE '%${escapeSqlString(options.name)}%'`);
  }

  if (options.email) {
    conditions.push(`email LIKE '%${escapeSqlString(options.email)}%'`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const allowedSortBy = ["id", "name", "email"];
  const sortBy = allowedSortBy.includes(options.sortBy || "")
    ? options.sortBy
    : "id";

  const sortDir = options.sortDir === "asc" ? "ASC" : "DESC";

  sql += ` ORDER BY ${sortBy} ${sortDir};`;

  return await all<User>(sql);
}

export async function getUserById(id: number): Promise<User | undefined> {
  return await get<User>(`
    SELECT id, name, email
    FROM Users
    WHERE id = ${id};
  `);
}

export async function createUser(
  name: string,
  email: string
): Promise<User> {
  const safeName = escapeSqlString(name);
  const safeEmail = escapeSqlString(email);

  const result = await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('${safeName}', '${safeEmail}', '${new Date().toISOString()}');
  `);

  const createdUser = await getUserById(result.lastID);

  if (!createdUser) {
    throw new Error("Failed to fetch created user");
  }

  return createdUser;
}

export async function updateUser(
  id: number,
  name: string,
  email: string
): Promise<User | null> {
  const safeName = escapeSqlString(name);
  const safeEmail = escapeSqlString(email);

  const result = await run(`
    UPDATE Users
    SET name = '${safeName}', email = '${safeEmail}'
    WHERE id = ${id};
  `);

  if (result.changes === 0) {
    return null;
  }

  const updatedUser = await getUserById(id);
  return updatedUser ?? null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await run(`
    DELETE FROM Users
    WHERE id = ${id};
  `);

  return result.changes > 0;
}