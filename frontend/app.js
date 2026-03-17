// =====================================================
// ====================== STATE =========================
// =====================================================

let posts = [];
let editingId = null;
let currentSortField = null;
let currentSortDirection = "asc";


// =====================================================
// ======================== DOM ========================
// =====================================================

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

const TableHead = document.querySelector("thead");

// =====================================================
// ======================== INIT =======================
// =====================================================

loadFromStorage();
render();


// =====================================================
// ====================== HANDLERS =====================
// =====================================================

form.addEventListener("submit", handleSubmit);
resetBtn.addEventListener("click", handleReset);
tableBody.addEventListener("click", handleTableClick);

searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);
sortSelect.addEventListener("change", render);

TableHead.addEventListener("click",  handleSortClick);


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
    clearErrors();
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

 
render ();
}
 function handleSortClick (e) {
    const field  = e.target.dataset.sort;
     if (!field) return;
      if (currentSortField === field){
        currentSortDirection = currentSortDirection === "asc" ? "desc" : "asc"
      }
      else 
      {
currentSortField = field;
currentSortDirection = "asc";
      }
      render();
  }

// =====================================================
// ======================= RENDER ======================
// =====================================================

function render() {
    tableBody.innerHTML = "";
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
if (currentSortField){
  filtered.sort (function (a, b) {


    let valueA = a[currentSortField];
    let valueB = b[currentSortField];

    if (typeof valueA === "string") {
      valueA = valueA.toLowerCase();
      valueB = valueB.toLowerCase();
    }
    if (valueA > valueB) return currentSortDirection === "asc" ? 1 : -1;
    if (valueA < valueB) return currentSortDirection === "asc" ? -1 : 1;
    return 0;

  });
}



  for (let i = 0; i < filtered.length; i++) {
    let post = filtered[i];

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


// =====================================================
// ===================== VALIDATION ====================
// =====================================================

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
    showError("titleInput", "titleError", "Поле обов'язкове");
    valid = false;
  } else if (dto.title.length < 3) {
    showError("titleInput", "titleError", "Мінімум 3 символи");
    valid = false;
  }

  if (!dto.category) {
    showError("categorySelect", "categoryError", "Оберіть категорію");
    valid = false;
  }

  if (!dto.body) {
    showError("bodyInput", "bodyError", "Поле обов'язкове");
    valid = false;
  } else if (dto.body.length < 5) {
    showError("bodyInput", "bodyError", "Мінімум 5 символів");
    valid = false;
  }

  if (!dto.author) {
    showError("authorInput", "authorError", "Поле обов'язкове");
    valid = false;
  } else if (dto.author.length < 3) {
    showError("authorInput", "authorError", "Мінімум 3 символи");
    valid = false;
  }

  for (let i = 0; i < posts.length; i++) {
    if (
      posts[i].title.toLowerCase() === dto.title.toLowerCase() &&
      editingId === null
    ) {
      showError("titleInput", "titleError", "Такий заголовок вже існує");
      return false;
    }
  }

  return valid;
}

function showError(inputId, errorId, message) {
  document.getElementById(inputId).classList.add("invalid");
  document.getElementById(errorId).textContent = message;
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


// =====================================================
// ====================== STORAGE ======================
// =====================================================

function saveToStorage() {
  localStorage.setItem("posts", JSON.stringify(posts));
}

function loadFromStorage() {
  const data = localStorage.getItem("posts");
  if (data) {
    posts = JSON.parse(data);
  }
}