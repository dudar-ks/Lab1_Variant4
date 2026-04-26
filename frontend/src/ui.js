// ================= DOM =================

export const elements = {
  form: document.getElementById("postsForm"),
  tableBody: document.getElementById("itemsTableBody"),

  title: document.getElementById("titleInput"),
  category: document.getElementById("categorySelect"),
  body: document.getElementById("bodyInput"),
  author: document.getElementById("authorInput"),

  search: document.getElementById("searchInput"),
  filter: document.getElementById("filterSelect"),

  submitBtn: document.querySelector("button[type='submit']"),

  notice: document.getElementById("notice"),
};

// ================= UI STATES =================

export function showLoading() {
  elements.notice.innerHTML = ""; //
  elements.tableBody.innerHTML = "<tr><td colspan='7'>Завантаження...</td></tr>";
}

export function showEmpty() {
  elements.tableBody.innerHTML = "<tr><td colspan='7'>Немає даних</td></tr>";
}

export function showError(err) {
  elements.notice.innerHTML =
    `Помилка (${err.status}): ${err.message}`;
}

// ================= RENDER =================

export function renderPosts(posts) {
  elements.tableBody.innerHTML = "";

  if (!posts.length) {
    showEmpty();
    return;
  }

  posts.forEach((post, i) => {
    const row = `
      <tr>
        <td>${i + 1}</td>
        <td>${post.title}</td>
        <td>${post.category}</td>
        <td>${post.author}</td>
        <td>${post.body}</td>
        <td>${new Date(post.createdAt).toLocaleString()}</td>
        <td>
          <button class="edit-btn" data-id="${post.id}">Edit</button>
          <button class="delete-btn" data-id="${post.id}">Delete</button>
        </td>
      </tr>
    `;

    elements.tableBody.innerHTML += row;
  });
}

// ================= FORM =================

export function getFormData() {
  return {
    title: elements.title.value.trim(),
    category: elements.category.value,
    body: elements.body.value.trim(),
    author: elements.author.value.trim(),
  };
}

export function fillForm(post) {
  elements.title.value = post.title;
  elements.category.value = post.category;
  elements.body.value = post.body;
  elements.author.value = post.author;
}

export function resetForm() {
  elements.form.reset();
}

export function setEditMode(isEdit) {
  elements.submitBtn.textContent = isEdit ? "Зберегти" : "Додати";
}

// ================= ERRORS =================

export function showNotice(text) {
  elements.notice.innerHTML = text;

  setTimeout(() => {
    elements.notice.innerHTML = "";
  }, 3000);
}

export function showFieldError(id, message) {
  const el = document.getElementById(id);
  el.classList.add("invalid");

  const err = document.getElementById(id + "Error");
  if (err) err.textContent = message;
}

export function clearErrors() {
  ["titleInput", "categorySelect", "bodyInput", "authorInput"].forEach(id => {
    document.getElementById(id).classList.remove("invalid");
  });

  ["titleError", "categoryError", "bodyError", "authorError"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = "";
  });
}   
export function setFormEnabled(enabled) {
  const allInputs = elements.form.querySelectorAll("input, textarea, select, button");
  allInputs.forEach(el => {
    el.disabled = !enabled;
  });
}