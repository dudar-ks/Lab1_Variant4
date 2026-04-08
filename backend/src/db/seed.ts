import { run } from "./db";
import { initDb } from "./initDb";

export async function seedDb() {
  await initDb();

  console.log("Seeding database...");

  await run("DELETE FROM Comments;");
  await run("DELETE FROM Posts;");
  await run("DELETE FROM Users;");

  await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('Oksana Dudar', 'oksana@example.com', '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('Anna Melnyk', 'anna@example.com', '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Users (name, email, createdAt)
    VALUES ('Ivan Petrenko', 'ivan@example.com', '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Posts (title, category, body, author, userId, createdAt)
    VALUES (
      'First Post',
      'study',
      'This is the first post for testing SQLite CRUD.',
      'Oksana Dudar',
      1,
      '${new Date().toISOString()}'
    );
  `);

  await run(`
    INSERT INTO Posts (title, category, body, author, userId, createdAt)
    VALUES (
      'Second Post',
      'news',
      'This is the second seeded post in the database.',
      'Anna Melnyk',
      2,
      '${new Date().toISOString()}'
    );
  `);

  await run(`
    INSERT INTO Posts (title, category, body, author, userId, createdAt)
    VALUES (
      'Third Post',
      'general',
      'This post is added as part of database seed initialization.',
      'Ivan Petrenko',
      3,
      '${new Date().toISOString()}'
    );
  `);

  await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('Great post!', 1, 2, '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('Very useful information.', 1, 3, '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('Thanks for sharing!', 2, 1, '${new Date().toISOString()}');
  `);

  await run(`
    INSERT INTO Comments (text, postId, userId, createdAt)
    VALUES ('Interesting example.', 3, 1, '${new Date().toISOString()}');
  `);

  console.log("Seed completed successfully");
}

seedDb().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});