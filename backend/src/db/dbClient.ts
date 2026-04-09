import fs from "fs";
import path from "path";
import sqlite3 from "sqlite3";

const dataDir = path.resolve(process.cwd(), "data");
const dbPath = path.resolve(dataDir, "app.db");

console.log("cwd =", process.cwd());
console.log("dataDir =", dataDir);
console.log("dbPath =", dbPath);

if (fs.existsSync(dataDir)) {
  const stat = fs.statSync(dataDir);
  console.log("dataDir isDirectory =", stat.isDirectory());
} else {
  fs.mkdirSync(dataDir, { recursive: true });
  console.log("dataDir created");
}

try {
  fs.accessSync(dataDir, fs.constants.W_OK);
  console.log("dataDir writable = yes");
} catch {
  console.log("dataDir writable = no");
}

export const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("SQLite connection error:", err.message);
    process.exit(1);
  }

  console.log("SQLite connected:", dbPath);
});