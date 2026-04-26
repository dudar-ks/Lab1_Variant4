import {
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from "./apiClient.js";

import {
  elements,
  renderPosts,
  showLoading,
  showError,
  getFormData,
  resetForm,
  setEditMode,
  fillForm,
  clearErrors,
  setFormEnabled,
  showNotice 
} from "./ui.js";

// ================= STATE =================

let posts = [];
let editingId = null;

// ================= INIT =================

loadPosts();

// ================= EVENTS =================

elements.form.addEventListener("submit", onSubmit);
elements.tableBody.addEventListener("click", onTableClick);

// ================= LOAD =================

async function loadPosts() {
  showLoading();

  try {
    posts = await getPosts();

  if (!posts || posts.length === 0) {
  showEmpty();
  return;
}

    renderPosts(posts);
  } catch (err) {
    showError(err);
  }
}

// ================= CREATE / UPDATE =================

async function onSubmit(e) {
  e.preventDefault();
  clearErrors();

  const dto = getFormData();

  if (!dto.title || dto.title.length < 3) {
    return showError({ status: 400, message: "Invalid title" });
  }

  setFormEnabled(false); 

  try {
  if (editingId === null) {
  await createPost(dto);
  showNotice("Створено!");
} else {
  await updatePost(editingId, dto);
  showNotice("Оновлено!");

      editingId = null;
      setEditMode(false);
    }

    resetForm();
    await loadPosts();

  } catch (err) {
    showError(err);
  } finally {
    setFormEnabled(true); 
  }
}

// ================= DELETE / EDIT =================

async function onTableClick(e) {
  const id = e.target.dataset.id;

  if (e.target.classList.contains("delete-btn")) {
    try {
      await deletePost(id);
      showNotice("Видалено!");
      await loadPosts();
    } catch (err) {
      showError(err);
    }
  }

  if (e.target.classList.contains("edit-btn")) {
    const post = posts.find(p => p.id == id);

    fillForm(post);
    editingId = id;
    setEditMode(true);
  }
}