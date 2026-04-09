import { db } from "./dbClient";

export function all<T>(sql: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, (err, rows) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(rows as T[]);
    });
  });
}

export function get<T>(sql: string): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(row as T | undefined);
    });
  });
}

export function run(sql: string): Promise<{ lastID: number; changes: number }> {
  return new Promise((resolve, reject) => {
    db.run(sql, function (this: sqlite3.RunResult, err) {
      if (err) {
        reject(err);
        return;
      }

      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

export function exec(sql: string): Promise<void> {
  return new Promise((resolve, reject) => {
    db.exec(sql, (err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

import sqlite3 from "sqlite3";