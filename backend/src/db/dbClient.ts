import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

sqlite3.verbose();

const dataDir = path.resolve(process.cwd(), "data");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, "app.db");
console.log(dbPath)

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection error:", err.message);
    process.exit(1);
  }

  console.log("SQLite connected:", dbPath);
});