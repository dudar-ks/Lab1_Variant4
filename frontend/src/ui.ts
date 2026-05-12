import type {
  ApiError,
  CommentDto,
  CommentWithUserDto,
  CreateCommentDto,
  CreatePostDto,
  CreateUserDto,
  PostDto,
  PostWithAuthorDto,
  UserDto,
  ViewName,
} from "./types.js";

export const elements = {
  formTitle: document.getElementById("formTitle") as HTMLHeadingElement,
  listTitle: document.getElementById("listTitle") as HTMLHeadingElement,

  navButtons: document.querySelectorAll<HTMLButtonElement>(".nav-btn"),

  form: document.getElementById("entityForm") as HTMLFormElement,
  submitBtn: document.getElementById("submitBtn") as HTMLButtonElement,
  resetBtn: document.getElementById("resetBtn") as HTMLButtonElement,

  postFields: document.getElementById("postFields") as HTMLDivElement,
  userFields: document.getElementById("userFields") as HTMLDivElement,
  commentFields: document.getElementById("commentFields") as HTMLDivElement,

  title: document.getElementById("titleInput") as HTMLInputElement,
  category: document.getElementById("categorySelect") as HTMLSelectElement,
  body: document.getElementById("bodyInput") as HTMLTextAreaElement,
  author: document.getElementById("authorInput") as HTMLInputElement,
  postUser: document.getElementById("postUserSelect") as HTMLSelectElement,

  userName: document.getElementById("userNameInput") as HTMLInputElement,
  userEmail: document.getElementById("userEmailInput") as HTMLInputElement,

  commentText: document.getElementById("commentTextInput") as HTMLTextAreaElement,
  commentPost: document.getElementById("commentPostSelect") as HTMLSelectElement,
  commentUser: document.getElementById("commentUserSelect") as HTMLSelectElement,

  search: document.getElementById("searchInput") as HTMLInputElement,
  filter: document.getElementById("filterSelect") as HTMLSelectElement,
  sort: document.getElementById("sortSelect") as HTMLSelectElement,

  notice: document.getElementById("notice") as HTMLDivElement,
  listStatus: document.getElementById("listStatus") as HTMLDivElement,
  tableHead: document.getElementById("tableHead") as HTMLTableSectionElement,
  tableBody: document.getElementById("itemsTableBody") as HTMLTableSectionElement,
  detailsPanel: document.getElementById("detailsPanel") as HTMLDivElement,
};

export function setView(view: ViewName): void {
  elements.navButtons.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.view === view);
  });

  elements.postFields.classList.toggle("hidden", view !== "posts");
  elements.userFields.classList.toggle("hidden", view !== "users");
  elements.commentFields.classList.toggle("hidden", view !== "comments");

  elements.filter.classList.toggle("hidden", view !== "posts");

  elements.formTitle.textContent =
    view === "posts" ? "Додати пост" :
    view === "users" ? "Додати користувача" :
    "Додати коментар";

  elements.listTitle.textContent =
    view === "posts" ? "Список постів" :
    view === "users" ? "Список користувачів" :
    "Список коментарів";
}

export function renderTableHead(view: ViewName): void {
  if (view === "posts") {
    elements.tableHead.innerHTML = `
      <tr>
        <th>№</th>
        <th>ID</th>
        <th>Заголовок</th>
        <th>Категорія</th>
        <th>Автор</th>
        <th>Дата</th>
        <th>Дії</th>
      </tr>
    `;
  }

  if (view === "users") {
    elements.tableHead.innerHTML = `
      <tr>
        <th>№</th>
        <th>ID</th>
        <th>Ім’я</th>
        <th>Email</th>
        <th>Дата</th>
        <th>Дії</th>
      </tr>
    `;
  }

  if (view === "comments") {
    elements.tableHead.innerHTML = `
      <tr>
        <th>№</th>
        <th>ID</th>
        <th>Текст</th>
        <th>Post ID</th>
        <th>User ID</th>
        <th>Дата</th>
        <th>Дії</th>
      </tr>
    `;
  }
}

export function showLoading(): void {
  elements.notice.innerHTML = "";
  elements.listStatus.className = "status loading";
  elements.listStatus.textContent = "Завантаження...";
  elements.tableBody.textContent = "";
  elements.detailsPanel.classList.add("hidden");
}

export function showSuccess(text = "Дані успішно завантажено"): void {
  elements.listStatus.className = "status success";
  elements.listStatus.textContent = text;
}

export function showEmpty(): void {
  elements.listStatus.className = "status empty";
  elements.listStatus.textContent = "Немає даних";

  elements.tableBody.textContent = "";

  const row = document.createElement("tr");
  const cell = document.createElement("td");

  cell.colSpan = 7;
  cell.className = "empty-cell";
  cell.textContent = "Нічого не знайдено";

  row.appendChild(cell);
  elements.tableBody.appendChild(row);
}

export function showError(err: ApiError): void {
  elements.listStatus.className = "status error";
  elements.listStatus.textContent = "Сталася помилка";

  const details = err.details ? `<div class="error-details">${escapeHtml(err.details)}</div>` : "";

  elements.notice.innerHTML = `
    <div class="notice-error">
      <b>Помилка (${err.status}):</b> ${escapeHtml(err.message)}
      ${details}
    </div>
  `;
}

export function showNotice(text: string): void {
  elements.notice.innerHTML = `<div class="notice-success">${escapeHtml(text)}</div>`;

  setTimeout(() => {
    elements.notice.innerHTML = "";
  }, 3500);
}

export function renderPosts(posts: PostDto[]): void {
  elements.tableBody.textContent = "";

  posts.forEach((post, index) => {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);

    const idCell = document.createElement("td");
    idCell.textContent = String(post.id);

    const titleCell = document.createElement("td");
    titleCell.textContent = post.title;

    const categoryCell = document.createElement("td");
    categoryCell.textContent = post.category;

    const authorCell = document.createElement("td");
    authorCell.textContent = post.author;

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(post.createdAt);

    const actionsCell = document.createElement("td");
    actionsCell.className = "actions";

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Деталі";
    detailsButton.dataset.action = "details";
    detailsButton.dataset.id = String(post.id);

    const editButton = document.createElement("button");
    editButton.textContent = "Редагувати";
    editButton.dataset.action = "edit";
    editButton.dataset.id = String(post.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(post.id);
    deleteButton.className = "danger";

    actionsCell.append(detailsButton, editButton, deleteButton);

    row.append(
      numberCell,
      idCell,
      titleCell,
      categoryCell,
      authorCell,
      dateCell,
      actionsCell
    );

    elements.tableBody.appendChild(row);
  });
}

export function renderUsers(users: UserDto[]): void {
  elements.tableBody.textContent = "";

  users.forEach((user, index) => {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);

    const idCell = document.createElement("td");
    idCell.textContent = String(user.id);

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(user.createdAt);

    const actionsCell = document.createElement("td");
    actionsCell.className = "actions";

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Деталі";
    detailsButton.dataset.action = "details";
    detailsButton.dataset.id = String(user.id);

    const editButton = document.createElement("button");
    editButton.textContent = "Редагувати";
    editButton.dataset.action = "edit";
    editButton.dataset.id = String(user.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(user.id);
    deleteButton.className = "danger";

    actionsCell.append(detailsButton, editButton, deleteButton);

    row.append(
      numberCell,
      idCell,
      nameCell,
      emailCell,
      dateCell,
      actionsCell
    );

    elements.tableBody.appendChild(row);
  });
}

export function renderComments(comments: CommentDto[]): void {
  elements.tableBody.textContent = "";

  comments.forEach((comment, index) => {
    const row = document.createElement("tr");

    const numberCell = document.createElement("td");
    numberCell.textContent = String(index + 1);

    const idCell = document.createElement("td");
    idCell.textContent = String(comment.id);

    const textCell = document.createElement("td");
    textCell.textContent = shortText(comment.text, 45);

    const postIdCell = document.createElement("td");
    postIdCell.textContent = String(comment.postId);

    const userIdCell = document.createElement("td");
    userIdCell.textContent = String(comment.userId);

    const dateCell = document.createElement("td");
    dateCell.textContent = formatDate(comment.createdAt);

    const actionsCell = document.createElement("td");
    actionsCell.className = "actions";

    const detailsButton = document.createElement("button");
    detailsButton.textContent = "Деталі";
    detailsButton.dataset.action = "details";
    detailsButton.dataset.id = String(comment.id);

    const editButton = document.createElement("button");
    editButton.textContent = "Редагувати";
    editButton.dataset.action = "edit";
    editButton.dataset.id = String(comment.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.dataset.action = "delete";
    deleteButton.dataset.id = String(comment.id);
    deleteButton.className = "danger";

    actionsCell.append(detailsButton, editButton, deleteButton);

    row.append(
      numberCell,
      idCell,
      textCell,
      postIdCell,
      userIdCell,
      dateCell,
      actionsCell
    );

    elements.tableBody.appendChild(row);
  });
}

export function renderUserOptions(users: UserDto[]): void {
  const options = [
    `<option value="">Оберіть користувача</option>`,
    ...users.map((user) => `<option value="${user.id}">${user.id}. ${escapeHtml(user.name)} — ${escapeHtml(user.email)}</option>`),
  ].join("");

  elements.postUser.innerHTML = options;
  elements.commentUser.innerHTML = options;
}

export function renderPostOptions(posts: PostDto[]): void {
  elements.commentPost.innerHTML = [
    `<option value="">Оберіть пост</option>`,
    ...posts.map((post) => `<option value="${post.id}">${post.id}. ${escapeHtml(post.title)}</option>`),
  ].join("");
}

export function getPostFormData(): CreatePostDto {
  return {
    title: elements.title.value.trim(),
    category: elements.category.value,
    body: elements.body.value.trim(),
    author: elements.author.value.trim(),
    userId: Number(elements.postUser.value),
  };
}

export function getUserFormData(): CreateUserDto {
  return {
    name: elements.userName.value.trim(),
    email: elements.userEmail.value.trim(),
  };
}

export function getCommentFormData(): CreateCommentDto {
  return {
    text: elements.commentText.value.trim(),
    postId: Number(elements.commentPost.value),
    userId: Number(elements.commentUser.value),
  };
}

export function fillPostForm(post: PostDto): void {
  elements.title.value = post.title;
  elements.category.value = post.category;
  elements.body.value = post.body;
  elements.author.value = post.author;
  elements.postUser.value = String(post.userId);
}

export function fillUserForm(user: UserDto): void {
  elements.userName.value = user.name;
  elements.userEmail.value = user.email;
}

export function fillCommentForm(comment: CommentDto): void {
  elements.commentText.value = comment.text;
  elements.commentPost.value = String(comment.postId);
  elements.commentUser.value = String(comment.userId);
}

export function resetForm(): void {
  elements.form.reset();
}

export function setEditMode(isEdit: boolean): void {
  elements.submitBtn.textContent = isEdit ? "Зберегти" : "Додати";
}

export function setFormEnabled(enabled: boolean): void {
  const fields = elements.form.querySelectorAll<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | HTMLButtonElement
  >("input, textarea, select, button");

  fields.forEach((field) => {
    field.disabled = !enabled;
  });
}

export function clearErrors(): void {
  document.querySelectorAll(".invalid").forEach((el) => el.classList.remove("invalid"));
  document.querySelectorAll(".error-text").forEach((el) => {
    el.textContent = "";
  });
}

export function showFieldError(inputId: string, message: string): void {
  const input = document.getElementById(inputId);
  const error = document.getElementById(`${inputId}Error`);

  input?.classList.add("invalid");
  if (error) error.textContent = message;
}

export function showBackendFieldErrors(err: ApiError): void {
  if (!err.errors?.length) return;

  const map: Record<string, string> = {
    title: "titleInput",
    category: "categorySelect",
    body: "bodyInput",
    author: "authorInput",
    userId: "postUserSelect",
    name: "userNameInput",
    email: "userEmailInput",
    text: "commentTextInput",
    postId: "commentPostSelect",
  };

  err.errors.forEach((fieldError) => {
    const inputId = map[fieldError.field];
    if (inputId) {
      showFieldError(inputId, fieldError.message);
    }
  });
}

export function renderPostDetails(
  post: PostWithAuthorDto,
  comments: CommentWithUserDto[]
): void {
  elements.detailsPanel.classList.remove("hidden");

  elements.detailsPanel.innerHTML = `
    <h3>Деталі поста #${post.id}</h3>
    <p><b>Заголовок:</b> ${escapeHtml(post.title)}</p>
    <p><b>Категорія:</b> ${escapeHtml(post.category)}</p>
    <p><b>Автор у пості:</b> ${escapeHtml(post.author)}</p>
    <p><b>Користувач:</b> ${escapeHtml(post.authorData.name)}</p>
    <p><b>Email:</b> ${escapeHtml(post.authorData.email)}</p>
    <p><b>Повний текст:</b></p>
    <div class="details-text">${escapeHtml(post.body)}</div>

    <h4>Коментарі</h4>
    ${
      comments.length
        ? comments.map((comment) => `
          <div class="comment-card">
            <b>${escapeHtml(comment.user.name)}</b>
            <span>${escapeHtml(comment.user.email)}</span>
            <p>${escapeHtml(comment.text)}</p>
          </div>
        `).join("")
        : `<p>Коментарів поки немає.</p>`
    }
  `;
}

export function renderUserDetails(user: UserDto): void {
  elements.detailsPanel.classList.remove("hidden");

  elements.detailsPanel.innerHTML = `
    <h3>Деталі користувача #${user.id}</h3>
    <p><b>Ім’я:</b> ${escapeHtml(user.name)}</p>
    <p><b>Email:</b> ${escapeHtml(user.email)}</p>
    <p><b>Створено:</b> ${formatDate(user.createdAt)}</p>
  `;
}

export function renderCommentDetails(
  comment: CommentDto,
  post?: PostWithAuthorDto,
  user?: UserDto
): void {
  elements.detailsPanel.classList.remove("hidden");

  elements.detailsPanel.innerHTML = `
    <h3>Деталі коментаря #${comment.id}</h3>
    <p><b>Текст:</b></p>
    <div class="details-text">${escapeHtml(comment.text)}</div>
    <p><b>Post ID:</b> ${comment.postId}</p>
    <p><b>User ID:</b> ${comment.userId}</p>
    <p><b>Пост:</b> ${post ? escapeHtml(post.title) : "—"}</p>
    <p><b>Користувач:</b> ${user ? `${escapeHtml(user.name)} (${escapeHtml(user.email)})` : "—"}</p>
    <p><b>Створено:</b> ${formatDate(comment.createdAt)}</p>
  `;
}

export function hideDetails(): void {
  elements.detailsPanel.classList.add("hidden");
  elements.detailsPanel.innerHTML = "";
}

function formatDate(value: string): string {
  return value ? new Date(value).toLocaleString("uk-UA") : "—";
}

function shortText(text: string, limit: number): string {
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}