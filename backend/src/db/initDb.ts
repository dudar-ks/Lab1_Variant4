import { run } from "./db";

export async function initDb() {
  await run(`PRAGMA foreign_keys = ON;`);

  await run(`
    CREATE TABLE IF NOT EXISTS Users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL CHECK(length(name) >= 2),
      email TEXT NOT NULL UNIQUE,
      createdAt TEXT NOT NULL
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT
      title TEXT NOT NULL CHECK(length(title) >= 2),
      category TEXT NOT NULL,
      body TEXT NOT NULL CHECK(length(body) >= 3),
      author TEXT NOT NULL,
      userId INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    );
  `);

  await run(`
    CREATE TABLE IF NOT EXISTS Comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      text TEXT NOT NULL CHECK(length(text) >= 1),
      postId INTEGER NOT NULL,
      userId INTEGER NOT NULL,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE RESTRICT
    );
  `);

  console.log("DB schema initialized");
}