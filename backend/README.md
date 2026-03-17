# LR2 REST API (TypeScript)

Це REST API, написаний на **Node.js** з використанням **Express** та **TypeScript**.

Дані зберігаються тільки в оперативній пам’яті (**in-memory repository**). База даних не використовується.

API побудовано за архітектурою з розділенням на **шари**:

- routes — прийом HTTP запитів
- controllers — обробка HTTP
- services — бізнес-логіка
- repositories — доступ до даних
- dtos — типи запитів та відповідей
- middleware — логування та обробка помилок

---

# 1. Як запустити проект

### Встановити залежності

```bash
npm install
```
### Запустити сервер у режимі розробки
```bash
npm run dev
```
### Сервер буде доступний за адресою
http://localhost:3000

### Перевірка роботи сервера

```bash
curl http://localhost:3000/health
```

Очікувана відповідь:

```json
{
  "ok": true
}
```

---

# 2. Реалізовані сутності

У проекті реалізовано три сутності.

## 1. Users

Поля:

* id
* name
* email

---

## 2. Posts

Поля:

* id
* title
* category
* body
* author
* createdAt

---

## 3. Comments

Поля:

* id
* text
* postId
* userId

---

# 3. Приклади запитів (curl)

## Users

### Отримати всіх користувачів

```bash
curl http://localhost:3000/api/users
```

### Отримати користувача за id

```bash
curl http://localhost:3000/api/users/1
```

### Створити користувача

```bash
curl -X POST http://localhost:3000/api/users \
-H "Content-Type: application/json" \
-d '{"name":"Oksana","email":"oksana@gmail.com"}'
```

### Оновити користувача

```bash
curl -X PUT http://localhost:3000/api/users/1 \
-H "Content-Type: application/json" \
-d '{"name":"Oksana Dudar","email":"oksana@gmail.com"}'
```
### Часткове оновлення користувача

```bash
curl -X PATCH http://localhost:3000/api/users/1 \
-H "Content-Type: application/json" \
-d "{\"name\":\"Oksana Updated\"}"
```

### Видалити користувача

```bash
curl -X DELETE http://localhost:3000/api/users/1
```

---

# Posts

### Отримати всі пости

```bash
curl http://localhost:3000/api/posts
```

### Отримати пост за id

```bash
curl http://localhost:3000/api/posts/1
```

### Створити пост

```bash
curl -X POST http://localhost:3000/api/posts \
-H "Content-Type: application/json" \
-d '{"title":"First post","category":"news","body":"Hello world","author":"Oksana"}'
```

### Оновити пост

```bash
curl -X PUT http://localhost:3000/api/posts/1 \
-H "Content-Type: application/json" \
-d '{"title":"Updated post","category":"news","body":"Updated text","author":"Oksana"}'
```

### Видалити пост

```bash
curl -X DELETE http://localhost:3000/api/posts/1
```

---

# Comments

### Отримати всі коментарі

```bash
curl http://localhost:3000/api/comments
```

### Отримати коментар за id

```bash
curl http://localhost:3000/api/comments/1
```

### Створити коментар

```bash
curl -X POST http://localhost:3000/api/comments \
-H "Content-Type: application/json" \
-d '{"text":"Nice post","postId":"1","userId":"1"}'
```

### Оновити коментар

```bash
curl -X PUT http://localhost:3000/api/comments/1 \
-H "Content-Type: application/json" \
-d '{"text":"Updated comment","postId":"1","userId":"1"}'
```

### Видалити коментар

```bash
curl -X DELETE http://localhost:3000/api/comments/1
```

---

# 4. Додаткові можливості для Users

### Підтримуються query params:

- `name` — фільтрація за ім’ям
- `email` — фільтрація за email
- `sortBy=name|email` — поле для сортування
- `sortDir=asc|desc` — напрям сортування
- `page` — номер сторінки
- `pageSize` — кількість елементів на сторінці

---

### Фільтрація

```bash
curl "http://localhost:3000/api/users?name=oks"
```

### Сортування і пагінація 
```bash
curl "http://localhost:3000/api/users?page=1&pageSize=5&sortBy=name&sortDir=asc"
```

# 5. Коди стану

- 200 — успішний запит
- 201 — створено ресурс
- 204 — успішно, без тіла відповіді
- 400 — помилка валідації
- 404 — не знайдено
- 500 — внутрішня помилка сервера