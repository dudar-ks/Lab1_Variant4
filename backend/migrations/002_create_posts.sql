CREATE TABLE IF NOT EXISTS Posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK(length(title) >= 2),
  category TEXT NOT NULL CHECK(length(category) >= 2),
  body TEXT NOT NULL CHECK(length(body) >= 3),
  author TEXT NOT NULL CHECK(length(author) >= 2),
  userId INTEGER NOT NULL,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);