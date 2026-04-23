# REST API з використанням SQLite

## Опис
У цій лабораторній роботі бекенд застосунку розширено шляхом підключення SQLite.
Робота з базою даних реалізована без ORM, через сирі SQL-запити.

## Як запустити проєкт

```bash
cd backend
npm install
npm run dev

Сервер буде доступний за адресою:

http://localhost:3000
Як зібрати проєкт
npm run build
npm start
Ініціалізація та файл бази даних

База даних створюється автоматично під час запуску застосунку.

Шлях до файлу бази даних:

./data/app.db

Файл .db не зберігається в репозиторії.

Seed тестових даних

Для заповнення бази тестовими записами:

npm run seed

Схема бази даних
Таблиця Users
id — INTEGER PRIMARY KEY AUTOINCREMENT
name — TEXT NOT NULL CHECK(length(name) >= 2)
email — TEXT NOT NULL UNIQUE
createdAt — TEXT NOT NULL
Таблиця Posts
id — INTEGER PRIMARY KEY AUTOINCREMENT
title — TEXT NOT NULL CHECK(length(title) >= 2)
category — TEXT NOT NULL
body — TEXT NOT NULL CHECK(length(body) >= 3)
author — TEXT NOT NULL
userId — INTEGER NOT NULL
createdAt — TEXT NOT NULL
FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
Таблиця Comments
id — INTEGER PRIMARY KEY AUTOINCREMENT
text — TEXT NOT NULL CHECK(length(text) >= 1)
postId — INTEGER NOT NULL
userId — INTEGER NOT NULL
createdAt — TEXT NOT NULL
FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE
FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE RESTRICT
Зв’язки між таблицями
Один користувач → багато постів (Users → Posts)
Один пост → багато коментарів (Posts → Comments)
Що реалізовано
підключення SQLite до Node.js-застосунку;
автоматичне створення схеми при старті;
CRUD для Users, Posts, Comments;
фільтрація і сортування списків;
FOREIGN KEY, CHECK, UNIQUE, NOT NULL;
seed тестових даних;
централізована обробка помилок;
приклади JOIN-запитів.

Приклади HTTP-запитів
1. Створити користувача
curl -X POST http://localhost:3000/api/users ^
  -H "Content-Type: application/json" ^
  -d "{\"name\":\"Oksana Dudar\",\"email\":\"oksana@example.com\"}"

2. Отримати список користувачів
curl http://localhost:3000/api/users

3. Створити пост
curl -X POST http://localhost:3000/api/posts ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"My first post\",\"category\":\"study\",\"body\":\"Hello SQLite world\",\"author\":\"Oksana Dudar\",\"userId\":1}"

4. Отримати список постів з фільтрацією і сортуванням
curl "http://localhost:3000/api/posts?category=study&sort=createdAt&order=desc"

5. Оновити коментар
curl -X PUT http://localhost:3000/api/comments/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"text\":\"Updated comment text\",\"postId\":1,\"userId\":2}"

6. Видалити пост
curl -X DELETE http://localhost:3000/api/posts/1
Приклад SQL-запиту з WHERE + ORDER + LIMIT
SELECT id, title, category, createdAt
FROM Posts
WHERE category = 'study'
ORDER BY createdAt DESC
LIMIT 5;

HTTP-коди стану
200 — успішне отримання або оновлення
201 — успішне створення
204 — успішне видалення
400 — помилка валідації
404 — ресурс не знайдено
409 — конфлікт даних
500 — внутрішня помилка сервера

### Забезпечення цілісності даних

При видаленні поста автоматично видаляються всі пов’язані коментарі завдяки використанню FOREIGN KEY з ON DELETE CASCADE.

Це дозволяє уникнути розсинхронізації даних між таблицями Posts і Comments та реалізує операцію, яка змінює кілька сутностей одночасно.