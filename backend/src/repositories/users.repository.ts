import bcrypt from "bcryptjs";
import { all, get, run } from "../db/db";
import type { UserEntity } from "../types/user.types";

export async function getUsers(params: {
  email?: string;
  sort?: string;
  order?: string;
}): Promise<UserEntity[]> {
  const { email, sort, order } = params;

  let sql = `
    SELECT id, name, email, createdAt
    FROM Users
  `;

  const conditions: string[] = [];
  const values: (string | number)[] = [];

  if (email) {
    conditions.push("email LIKE ?");
    values.push(`%${email}%`);
  }

  if (conditions.length > 0) {
    sql += ` WHERE ${conditions.join(" AND ")}`;
  }

  const allowedSort = ["id", "name", "email", "createdAt"];
  const sortField = allowedSort.includes(sort || "") ? sort : "id";
  const sortOrder = order === "desc" ? "DESC" : "ASC";

  sql += ` ORDER BY ${sortField} ${sortOrder};`;

  return await all<UserEntity>(sql, values);
}

export async function getUserById(id: number): Promise<UserEntity | undefined> {
  return await get<UserEntity>(
    `
      SELECT id, name, email, createdAt
      FROM Users
      WHERE id = ?;
    `,
    [id]
  );
}

export async function createUser(
  name: string,
  email: string
): Promise<UserEntity> {
  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  const result = await run(
    `
      INSERT INTO Users (name, email, passwordHash, role, createdAt)
      VALUES (?, ?, ?, ?, ?);
    `,
    [name, email, defaultPasswordHash, "user", new Date().toISOString()]
  );

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
): Promise<UserEntity | null> {
  const result = await run(
    `
      UPDATE Users
      SET name = ?, email = ?
      WHERE id = ?;
    `,
    [name, email, id]
  );

  if (result.changes === 0) {
    return null;
  }

  return (await getUserById(id)) ?? null;
}

export async function deleteUser(id: number): Promise<boolean> {
  const result = await run(
    `
      DELETE FROM Users
      WHERE id = ?;
    `,
    [id]
  );

  return result.changes > 0;
}