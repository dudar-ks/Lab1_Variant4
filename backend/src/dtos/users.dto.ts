export type CreateUserRequestDto = {
  name: string;
  email: string;
};

export type UpdateUserRequestDto = {
  name: string;
  email: string;
};

export type UserResponseDto = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};