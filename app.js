let posts = [];
let editingId = null;

const form = document.getElementById("postsForm");
const tableBody = document.getElementById("itemsTableBody");
const resetBtn = document.getElementById("resetBtn");

const searchInput = document.getElementById("searchInput");
const filterSelect = document.getElementById("filterSelect");
const sortSelect = document.getElementById("sortSelect");

const titleInput = document.getElementById("titleInput");
const categorySelect = document.getElementById("categorySelect");
const bodyInput = document.getElementById("bodyInput");
const authorInput = document.getElementById("authorInput");

loadFromStorage();
render();

form.addEventListener("submit", handleSubmit);
resetBtn.addEventListener("click", handleReset);
tableBody.addEventListener("click", handleTableClick);

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

function handleSubmit(e) {
  e.preventDefault();
  clearErrors();

  const dto = readForm();
  if (!validate(dto)) return;

  if (editingId === null) {
    posts.push({
      id: Date.now(),
      title: dto.title,
      category: dto.category,
      body: dto.body,
      author: dto.author,
      createdAt: Date.now()
    });
  } else {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === editingId) {
        posts[i].title = dto.title;
        posts[i].category = dto.category;
        posts[i].body = dto.body;
        posts[i].author = dto.author;
      }
    }
    editingId = null;
    form.querySelector("button[type='submit']").textContent = "Додати";
  }

  saveToStorage();
  render();
  form.reset();
}

function handleReset() {
  form.reset();
  clearErrors();
  editingId = null;
  form.querySelector("button[type='submit']").textContent = "Додати";
}

function handleTableClick(e) {
  const id = Number(e.target.dataset.id);

  if (e.target.classList.contains("delete-btn")) {
    posts = posts.filter(function(post) {
      return post.id !== id;
    });
    saveToStorage();
    render();
  }

  if (e.target.classList.contains("edit-btn")) {
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].id === id) {
        titleInput.value = posts[i].title;
        categorySelect.value = posts[i].category;
        bodyInput.value = posts[i].body;
        authorInput.value = posts[i].author;
      }
    }

    editingId = id;
    form.querySelector("button[type='submit']").textContent = "Зберегти";
  }
}

function readForm() {
  return {
    title: titleInput.value.trim(),
    category: categorySelect.value,
    body: bodyInput.value.trim(),
    author: authorInput.value.trim()
  };
}

function validate(dto) {
  let valid = true;

  if (!dto.title) {
    showError("titleInput", "titleError");
    valid = false;
  }

  if (!dto.category) {
    showError("categorySelect", "categoryError");
    valid = false;
  }

  if (!dto.body) {
    showError("bodyInput", "bodyError");
    valid = false;
  }

  if (!dto.author) {
    showError("authorInput", "authorError");
    valid = false;
  }

  for (let i = 0; i < posts.length; i++) {
    if (
      posts[i].title.toLowerCase() === dto.title.toLowerCase() &&
      editingId === null
    ) {
      showError("titleInput", "titleError");
      document.getElementById("titleError").textContent =
        "Запис з таким заголовком вже існує";
      return false;
    }
  }

  return valid;
}

function showError(inputId, errorId) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).textContent = "Поле обов'язкове";
}

function clearErrors() {
  titleInput.classList.remove("invalid");
  categorySelect.classList.remove("invalid");
  bodyInput.classList.remove("invalid");
  authorInput.classList.remove("invalid");

  document.getElementById("titleError").textContent = "";
  document.getElementById("categoryError").textContent = "";
  document.getElementById("bodyError").textContent = "";
  document.getElementById("authorError").textContent = "";
}

function render() {
  let filtered = posts.slice();

  const search = searchInput.value.toLowerCase();
  if (search) {
    filtered = filtered.filter(function(post) {
      return post.title.toLowerCase().includes(search);
    });
  }

  if (filterSelect.value) {
    filtered = filtered.filter(function(post) {
      return post.category === filterSelect.value;
    });
  }

  if (sortSelect.value === "new") {
    filtered.sort(function(a, b) {
      return b.createdAt - a.createdAt;
    });
  } else {
    filtered.sort(function(a, b) {
      return a.createdAt - b.createdAt;
    });
  }

  tableBody.innerHTML = "";

  for (let i = 0; i < filtered.length; i++) {
    const post = filtered[i];

    tableBody.innerHTML +=
      "<tr>" +
      "<td>" + (i + 1) + "</td>" +
      "<td>" + post.title + "</td>" +
      "<td>" + post.category + "</td>" +
      "<td>" + post.author + "</td>" +
      "<td>" + post.body + "</td>" +
      "<td>" + new Date(post.createdAt).toLocaleString() + "</td>" +
      "<td>" +
      "<button class='edit-btn' data-id='" + post.id + "'>Редагувати</button>" +
      "<button class='delete-btn' data-id='" + post.id + "'>Видалити</button>" +
      "</td>" +
      "</tr>";
  }
}

function saveToStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function loadFromStorage() {
  const data = localStorage.getItem("posts");
  if (data) {
    posts = JSON.parse(data);
  }
}