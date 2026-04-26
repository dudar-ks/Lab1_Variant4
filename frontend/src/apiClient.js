import { API_BASE_URL } from "./config.js";

// універсальний request
async function request(url, options = {}) {
  let response;
 console.log("API CALL:", API_BASE_URL + url);
  try {
  response = await fetch(`${API_BASE_URL}${url}`, {
  method: options.method || "GET",
  headers: {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  },
  body: options.body,
});

  } catch (e) {
    throw {
      status: 0,
      message: "Помилка мережі або CORS",
      details: e.message,
    };
  }
if (response.status === 204) {
  return null;
}
  const text = await response.text();

  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || "HTTP помилка",
      details: data?.details || text,
    };
  }

  return data;
}

// ===== API METHODS =====

const BASE = "/posts";

export function getPosts() {
  return request(BASE);
}

export function getPostById(id) {
  return request(`${BASE}/${id}`);
}

export function createPost(dto) {
  return request(BASE, {
    method: "POST",
    body: JSON.stringify(dto),
  });
}

export function updatePost(id, dto) {
  return request(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dto),
  });
}

export function deletePost(id) {
  return request(`${BASE}/${id}`, {
    method: "DELETE",
  });
}