# LR2 REST API (TypeScript)

Це REST API, написаний на **Node.js** з використанням **Express** та **TypeScript**.

Дані зберігаються тільки в оперативній пам’яті (**in-memory repository**). База даних не використовується.

API побудовано за архітектурою з розділенням на **шари**:

* routes — прийом HTTP запитів
* controllers — обробка HTTP
* services — бізнес-логіка
* repositories — доступ до даних
* dtos — типи запитів та відповідей
* middleware — логування та обробка помилок

---

# 1. Як запустити проект

### 1. Встановити залежності

```bash
npm install
```

### 2. Запустити сервер у режимі розробки

```bash
npm run dev
```

### 3. Сервер буде доступний за адресою

```
http://localhost:3000
```

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