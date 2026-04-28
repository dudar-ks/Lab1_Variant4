import { API_BASE_URL } from "./config.js";
import type {
  ApiError,
  CommentDto,
  CommentWithUserDto,
  CreateCommentDto,
  CreatePostDto,
  CreateUserDto,
  PostDto,
  PostWithAuthorDto,
  UserDto,
} from "./types.js";

async function request<T>(
  path: string,
  options: RequestInit = {},
  timeoutMs = 10000
): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  let response: Response;

  try {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string> | undefined),
    };

    if (options.body) {
      headers["Content-Type"] = "application/json";
    }

    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      signal: controller.signal,
    });
  } catch (e) {
    throw {
      status: 0,
      message:
        e instanceof DOMException && e.name === "AbortError"
          ? "Запит перевищив час очікування"
          : "Помилка мережі або CORS. Перевір, чи запущений бекенд.",
      details: e instanceof Error ? e.message : String(e),
    } satisfies ApiError;
  } finally {
    clearTimeout(timeoutId);
  }

  if (response.status === 204) {
    return null as T;
  }

  const rawText = await response.text();

  let data: any = null;
  try {
    data = rawText ? JSON.parse(rawText) : null;
  } catch {
    data = rawText;
  }

  if (!response.ok) {
    const backendError = data?.error;

    throw {
      status: response.status,
      message:
        backendError?.message ||
        data?.message ||
        data?.title ||
        "HTTP помилка",
      details:
        backendError?.details && Array.isArray(backendError.details)
          ? backendError.details.map((e: any) => `${e.field}: ${e.message}`).join("; ")
          : data?.details || data?.detail || rawText,
      errors: backendError?.details || data?.errors || [],
    } satisfies ApiError;
  }

  return data as T;
}

type ListResponse<T> = {
  items: T[];
  total?: number;
};

type ItemResponse<T> = {
  item: T;
};

function buildQuery(params: Record<string, string | number | undefined>): string {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export async function getPosts(params: {
  category?: string;
  author?: string;
  userId?: number;
  sort?: string;
  order?: string;
} = {}): Promise<PostDto[]> {
  const response = await request<ListResponse<PostDto>>(`/posts${buildQuery(params)}`);
  return response.items;
}

export async function getPostById(id: number | string): Promise<PostDto> {
  const response = await request<ItemResponse<PostDto>>(`/posts/${id}`);
  return response.item;
}

export async function getPostWithAuthor(id: number | string): Promise<PostWithAuthorDto> {
  const response = await request<ItemResponse<PostWithAuthorDto>>(`/posts/${id}/with-author`);
  return response.item;
}

export async function createPost(dto: CreatePostDto): Promise<PostDto> {
  const response = await request<ItemResponse<PostDto>>("/posts", {
    method: "POST",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function updatePost(id: number | string, dto: CreatePostDto): Promise<PostDto> {
  const response = await request<ItemResponse<PostDto>>(`/posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function deletePost(id: number | string): Promise<null> {
  return request<null>(`/posts/${id}`, { method: "DELETE" });
}

export async function getUsers(params: {
  email?: string;
  sort?: string;
  order?: string;
} = {}): Promise<UserDto[]> {
  const response = await request<ListResponse<UserDto>>(`/users${buildQuery(params)}`);
  return response.items;
}

export async function getUserById(id: number | string): Promise<UserDto> {
  const response = await request<ItemResponse<UserDto>>(`/users/${id}`);
  return response.item;
}

export async function createUser(dto: CreateUserDto): Promise<UserDto> {
  const response = await request<ItemResponse<UserDto>>("/users", {
    method: "POST",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function updateUser(id: number | string, dto: CreateUserDto): Promise<UserDto> {
  const response = await request<ItemResponse<UserDto>>(`/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function deleteUser(id: number | string): Promise<null> {
  return request<null>(`/users/${id}`, { method: "DELETE" });
}

export async function getComments(params: {
  postId?: number;
  userId?: number;
  sort?: string;
  order?: string;
} = {}): Promise<CommentDto[]> {
  const response = await request<ListResponse<CommentDto>>(`/comments${buildQuery(params)}`);
  return response.items;
}

export async function getCommentById(id: number | string): Promise<CommentDto> {
  const response = await request<ItemResponse<CommentDto>>(`/comments/${id}`);
  return response.item;
}

export async function getCommentsWithUsers(postId: number | string): Promise<CommentWithUserDto[]> {
  const response = await request<ListResponse<CommentWithUserDto>>(
    `/comments/post/${postId}/users`
  );

  return response.items;
}

export async function createComment(dto: CreateCommentDto): Promise<CommentDto> {
  const response = await request<ItemResponse<CommentDto>>("/comments", {
    method: "POST",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function updateComment(
  id: number | string,
  dto: CreateCommentDto
): Promise<CommentDto> {
  const response = await request<ItemResponse<CommentDto>>(`/comments/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });

  return response.item;
}

export async function deleteComment(id: number | string): Promise<null> {
  return request<null>(`/comments/${id}`, { method: "DELETE" });
}