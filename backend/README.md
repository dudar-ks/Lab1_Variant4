# Lab 4 — Fullstack CRUD Application (TypeScript + SQLite)

## Опис

У цій лабораторній роботі реалізовано **fullstack CRUD-застосунок** з використанням:

- **Frontend:** HTML, CSS, TypeScript
- **Backend:** Node.js, Express, TypeScript
- **Database:** SQLite
- **HTTP API:** REST API
- **Без ORM** — використані сирі SQL-запити.

Проєкт працює з трьома сутностями:

- Users
- Posts
- Comments

---

# Як запустити проєкт

## 1. Backend

```bash
cd backend
npm install
npm run dev
```
## Сервер буде доступний:

- http://localhost:3000

### Перевірка health-check:

- http://localhost:3000/health

## 2. Frontend
```bash
cd frontend
npm install
npx tsc
npx http-server -p 5500
```

## Frontend буде доступний:

- http://localhost:5500

### Збірка проєкту
```bash
Backend build
cd backend
npm run build
npm start
```
--- 

## База даних

База створюється автоматично під час запуску.

## Шлях до файлу:

- ./data/app.db

Файл .db не зберігається у репозиторії.

## Seed тестових даних

```bash
 cd backend
 npm run seed
 ```

# Схема бази даних
## Users
- id — INTEGER PRIMARY KEY AUTOINCREMENT
- name — TEXT NOT NULL CHECK(length(name) >= 2)
- email — TEXT NOT NULL UNIQUE
- createdAt — TEXT NOT NULL
## Posts
- id — INTEGER PRIMARY KEY AUTOINCREMENT
- title — TEXT NOT NULL CHECK(length(title) >= 2)
- category — TEXT NOT NULL
- body — TEXT NOT NULL CHECK(length(body) >= 3)
- author — TEXT NOT NULL
- userId — INTEGER NOT NULL
- createdAt — TEXT NOT NULL

## FOREIGN KEY:
- FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE

### Comments
- id — INTEGER PRIMARY KEY AUTOINCREMENT
- text — TEXT NOT NULL CHECK(length(text) >= 1)
- postId — INTEGER NOT NULL
- userId — INTEGER NOT NULL
- createdAt — TEXT NOT NULL

## FOREIGN KEY:
- FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
- FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE RESTRICT

### Зв’язки між таблицями
- Один користувач → багато постів
- Один пост → багато коментарів
- Один користувач → багато коментарів

### Реалізовано

- CRUD для Users / Posts / Comments
- Navbar для перемикання сутностей
- Детальний перегляд записів
- Dropdown для userId / postId
- Сортування
- Фільтрація
- Loading / Success / Empty / Error states
- Timeout / Network error / CORS error handling
- Валідація на frontend і backend
- Централізована обробка помилок
- TypeScript DTO
- API Client module
- JOIN-запити
- Seed тестових даних

### Як перевірити функціонал

## GET

- Отримати список постів:

http://localhost:3000/api/v1/posts

- Отримати список users:

http://localhost:3000/api/v1/users

- Отримати список comments:

http://localhost:3000/api/v1/comments

## POST

- Створити пост через UI:

http://localhost:5500

- Або через curl:
```
curl -X POST http://localhost:3000/api/v1/posts ^
- H "Content-Type: application/json" ^
- d "{\"title\":\"Test\",\"category\":\"news\",\"body\":\"Hello world\",\"author\":\"Oksana\",\"userId\":1}"
```
## PUT

- Оновити запис через кнопку Edit у UI.

## DELETE

- Видалити запис через кнопку Delete у UI.

---

# Validation Error

Спробувати:

- title менше 3 символів;
- body менше 5 символів;
- некоректний email;
- порожні поля.

### Network / Timeout Error

- Зупинити backend:

```
Ctrl + C
```
та спробувати зробити запит.
```
- CORS Error
```
Запустити frontend з іншого порту.

### Приклади HTTP-запитів

## Створити користувача
```
curl -X POST http://localhost:3000/api/v1/users ^
-H "Content-Type: application/json" ^
-d "{\"name\":\"Oksana Dudar\",\"email\":\"oksana@example.com\"}"
```
## Створити коментар
```
curl -X POST http://localhost:3000/api/v1/comments ^
-H "Content-Type: application/json" ^
-d "{\"text\":\"Nice post!\",\"postId\":1,\"userId\":1}"
```
### HTTP-коди
- 200 — OK
- 201 — Created
- 204 — No Content
- 400 — Validation Error
- 404 — Not Found
- 409 — Conflict
- 500 — Internal Server Error

### Цілісність даних

При видаленні поста автоматично видаляються всі пов’язані коментарі:

ON DELETE CASCADE

Це забезпечує узгодженість між таблицями.