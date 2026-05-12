import { get } from "../db/db";

export type AuthUserEntity = {
  id: number;
  name: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin";
  createdAt: string;
};

export async function getUserByEmail(
  email: string
): Promise<AuthUserEntity | undefined> {
  return await get<AuthUserEntity>(
    `
      SELECT id, name, email, passwordHash, role, createdAt
      FROM Users
      WHERE email = ?;
    `,
    [email]
  );
}

export async function getUserById(
  id: number
): Promise<AuthUserEntity | undefined> {
  return await get<AuthUserEntity>(
    `
      SELECT id, name, email, passwordHash, role, createdAt
      FROM Users
      WHERE id = ?;
    `,
    [id]
  );
}