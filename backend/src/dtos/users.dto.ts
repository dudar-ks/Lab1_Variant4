export type CreateUserRequestDto = {
  name: string;
  email: string;
};

export type UpdateUserRequestDto = {
  name: string;
  email: string;
};

export type PatchUserRequestDto = {
  name?: string;
  email?: string;
};

import type { User } from "../types/user.types";

export type UserResponseDto = {
  id: string;
  name: string;
  email: string;
};

export function toUserResponseDto(user: User): UserResponseDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}