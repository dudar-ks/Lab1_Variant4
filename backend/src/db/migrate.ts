import fs from "fs";
import path from "path";
import { exec, run, get } from "./db";

type MigrationRow = {
  id: number;
  filename: string;
  appliedAt: string;
};

export async function runMigrations(): Promise<void> {
  await run("PRAGMA foreign_keys = ON;");

  await run(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      appliedAt TEXT NOT NULL
    );
  `);

  const migrationsDir = path.resolve(process.cwd(), "migrations");
  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  for (const filename of files) {
    const escapedFilename = filename.replace(/'/g, "''");

    const existing = await get<MigrationRow>(`
      SELECT id, filename, appliedAt
      FROM schema_migrations
      WHERE filename = '${escapedFilename}';
    `);

    if (existing) {
      continue;
    }

    const sql = fs.readFileSync(path.join(migrationsDir, filename), "utf8");
    await exec(sql);

    await run(`
      INSERT INTO schema_migrations (filename, appliedAt)
      VALUES ('${escapedFilename}', '${new Date().toISOString()}');
    `);

    console.log(`Migration applied: ${filename}`);
  }

  console.log("DB initialized");
}