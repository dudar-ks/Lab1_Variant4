import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../errors/ApiError";
import * as authRepository from "../repositories/auth.repository";
import { blacklistToken } from "./token-blacklist.service";
import {
  checkLoginAllowed,
  clearFailedLogins,
  recordFailedLogin
} from "./login-attempts.service";

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

export async function login(email: string, password: string, ip: string) {
  if (!email || !password) {
    throw new ApiError(
      400,
      "VALIDATION_ERROR",
      "Email and password are required"
    );
  }

  const normalizedEmail = email.trim().toLowerCase();

  checkLoginAllowed(normalizedEmail, ip);

  const user = await authRepository.getUserByEmail(normalizedEmail);

  if (!user) {
    recordFailedLogin(normalizedEmail, ip);

    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    recordFailedLogin(normalizedEmail, ip);

    throw new ApiError(401, "INVALID_CREDENTIALS", "Invalid credentials");
  }

  clearFailedLogins(normalizedEmail, ip);

  const token = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}
export async function getMe(userId: number) {
  const user = await authRepository.getUserById(userId);

  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED", "Unauthorized");
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role
  };
}

export async function logout(token: string) {
  blacklistToken(token);

  return {
    message: "Logout successful. Token has been invalidated."
  };
}