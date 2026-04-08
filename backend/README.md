# REST API з використанням SQLite

## Опис

У цій лабораторній роботі було розширено бекенд застосунку шляхом додавання збереження даних у SQLite.  
Реалізовано роботу з базою даних без використання ORM.

---

## Як запустити проєкт

1. Перейти в папку backend:
```bash
cd backend
Встановити залежності:
npm install
Запустити сервер:
npm run dev

Сервер буде доступний за адресою:

http://localhost:3000
База даних

Файл бази даних створюється автоматично при запуску:

./data/app.db

Файл не зберігається в репозиторії.

Схема бази даних

Таблиця Users
id (PRIMARY KEY)
name (TEXT, NOT NULL)
email (TEXT, NOT NULL, UNIQUE)

Таблиця Posts
id (PRIMARY KEY)
title (TEXT, NOT NULL)
category (TEXT, NOT NULL)
body (TEXT, NOT NULL)
author (TEXT, NOT NULL)
userId (INTEGER, FOREIGN KEY → Users.id)
createdAt (TEXT, NOT NULL)

Таблиця Comments
id (PRIMARY KEY)
text (TEXT, NOT NULL)
postId (INTEGER, FOREIGN KEY → Posts.id)
userId (INTEGER, FOREIGN KEY → Users.id)

Зв’язки
Один користувач → багато постів (1:N)
Один пост → багато коментарів (1:N)

Використовується FOREIGN KEY з підтримкою цілісності даних.

Приклади запитів
Створити користувача
POST /api/users
{
  "name": "Oksana",
  "email": "oksana@example.com"
}
Створити пост
POST /api/posts
{
  "title": "My first post",
  "category": "study",
  "body": "Hello SQLite",
  "author": "Oksana",
  "userId": 1
}
Отримати всі пости
GET /api/posts
Отримати пост за id
GET /api/posts/1
Приклад SQL-запиту (WHERE + ORDER + LIMIT)
SELECT * FROM posts
WHERE category = 'study'
ORDER BY createdAt DESC
LIMIT 5;

Обробка помилок
201 — успішне створення
400 — помилка валідації
404 — ресурс не знайдено
500 — внутрішня помилка сервера

  Що реалізовано
Підключення SQLite до Node.js
Ініціалізація бази даних при старті
CRUD для сутностей Users і Posts
Зв’язки між таблицями через FOREIGN KEY
Валідація вхідних даних
Обробка помилок через middleware