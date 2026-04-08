import { exec, run, get } from "./db";

type Migration = {
  name: string;
  sql: string;
};

const migrations: Migration[] = [
  {
    name: "001_create_base_tables",
    sql: `
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL CHECK(length(name) >= 2),
        email TEXT NOT NULL UNIQUE,
        createdAt TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS Posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL CHECK(length(title) >= 2),
        category TEXT NOT NULL,
        body TEXT NOT NULL CHECK(length(body) >= 3),
        author TEXT NOT NULL,
        userId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS Comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL CHECK(length(text) >= 1),
        postId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
        FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE RESTRICT
      );
    `,
  },
  {
    name: "002_create_indexes",
    sql: `
      CREATE INDEX IF NOT EXISTS idx_posts_userId_createdAt
      ON Posts(userId, createdAt);

      CREATE INDEX IF NOT EXISTS idx_comments_postId
      ON Comments(postId);
    `,
  },
];

export async function initDb() {
  await run("PRAGMA foreign_keys = ON;");

  await run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      appliedAt TEXT NOT NULL
    );
  `);

  for (const migration of migrations) {
    const existing = await get(
      `SELECT * FROM schema_migrations WHERE name = '${migration.name}'`
    );

    if (!existing) {
      await exec(migration.sql);
      await run(`
        INSERT INTO schema_migrations (name, appliedAt)
        VALUES ('${migration.name}', '${new Date().toISOString()}')
      `);

      console.log(`Migration applied: ${migration.name}`);
    }
  }

  console.log("DB initialized");
}