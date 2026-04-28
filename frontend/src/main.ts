import {
  createComment,
  createPost,
  createUser,
  deleteComment,
  deletePost,
  deleteUser,
  getCommentById,
  getComments,
  getCommentsWithUsers,
  getPostWithAuthor,
  getPosts,
  getUserById,
  getUsers,
  updateComment,
  updatePost,
  updateUser,
} from "./apiClient.js";

import {
  clearErrors,
  elements,
  fillCommentForm,
  fillPostForm,
  fillUserForm,
  getCommentFormData,
  getPostFormData,
  getUserFormData,
  hideDetails,
  renderCommentDetails,
  renderComments,
  renderPostDetails,
  renderPostOptions,
  renderPosts,
  renderTableHead,
  renderUserDetails,
  renderUserOptions,
  renderUsers,
  resetForm,
  setEditMode,
  setFormEnabled,
  setView,
  showBackendFieldErrors,
  showEmpty,
  showError,
  showFieldError,
  showLoading,
  showNotice,
  showSuccess,
} from "./ui.js";

import type {
  ApiError,
  CommentDto,
  PostDto,
  UserDto,
  ViewName,
} from "./types.js";

let currentView: ViewName = "posts";
let editingId: number | null = null;

let posts: PostDto[] = [];
let users: UserDto[] = [];
let comments: CommentDto[] = [];

init();

function init(): void {
  elements.navButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const view = button.dataset.view as ViewName;
      switchView(view);
    });
  });

  elements.form.addEventListener("submit", onSubmit);
  elements.resetBtn.addEventListener("click", cancelEditing);
  elements.tableBody.addEventListener("click", onTableClick);

  elements.search.addEventListener("input", loadCurrentView);
  elements.filter.addEventListener("change", loadCurrentView);
  elements.sort.addEventListener("change", loadCurrentView);

  switchView("posts");
}

async function switchView(view: ViewName): Promise<void> {
  currentView = view;
  editingId = null;

  setView(view);
  renderTableHead(view);
  resetForm();
  clearErrors();
  hideDetails();
  setEditMode(false);

  await loadDictionaries();
  await loadCurrentView();
}

async function loadDictionaries(): Promise<void> {
  try {
    users = await getUsers({ sort: "id", order: "asc" });
    posts = await getPosts({ sort: "id", order: "asc" });

    renderUserOptions(users);
    renderPostOptions(posts);
  } catch (err) {
    showError(err as ApiError);
  }
}

async function loadCurrentView(): Promise<void> {
  showLoading();
  hideDetails();

  try {
    const [sort, order] = elements.sort.value.split("-");

    if (currentView === "posts") {
      posts = await getPosts({
        category: elements.filter.value || undefined,
        author: elements.search.value || undefined,
        sort,
        order,
      });

      if (!posts.length) {
        showEmpty();
        return;
      }

      renderPosts(posts);
      showSuccess("Пости завантажено");
      return;
    }

    if (currentView === "users") {
      users = await getUsers({
        email: elements.search.value || undefined,
        sort: sort === "title" || sort === "createdAt" ? "id" : sort,
        order,
      });

      if (!users.length) {
        showEmpty();
        return;
      }

      renderUsers(users);
      showSuccess("Користувачів завантажено");
      return;
    }

    comments = await getComments({
      sort: sort === "title" ? "id" : sort,
      order,
    });

    const search = elements.search.value.trim().toLowerCase();
    const filteredComments = search
      ? comments.filter((comment) => comment.text.toLowerCase().includes(search))
      : comments;

    if (!filteredComments.length) {
      showEmpty();
      return;
    }

    renderComments(filteredComments);
    showSuccess("Коментарі завантажено");
  } catch (err) {
    showError(err as ApiError);
  }
}

async function onSubmit(event: SubmitEvent): Promise<void> {
  event.preventDefault();

  clearErrors();

  const isValid = validateCurrentForm();
  if (!isValid) return;

  setFormEnabled(false);

  try {
    if (currentView === "posts") {
      const dto = getPostFormData();

      if (editingId === null) {
        await createPost(dto);
        showNotice("Пост створено!");
      } else {
        await updatePost(editingId, dto);
        showNotice("Пост оновлено!");
      }
    }

    if (currentView === "users") {
      const dto = getUserFormData();

      if (editingId === null) {
        await createUser(dto);
        showNotice("Користувача створено!");
      } else {
        await updateUser(editingId, dto);
        showNotice("Користувача оновлено!");
      }
    }

    if (currentView === "comments") {
      const dto = getCommentFormData();

      if (editingId === null) {
        await createComment(dto);
        showNotice("Коментар створено!");
      } else {
        await updateComment(editingId, dto);
        showNotice("Коментар оновлено!");
      }
    }

    editingId = null;
    setEditMode(false);
    resetForm();

    await loadDictionaries();
    await loadCurrentView();
  } catch (err) {
    const apiError = err as ApiError;
    showError(apiError);
    showBackendFieldErrors(apiError);
  } finally {
    setFormEnabled(true);
  }
}

async function onTableClick(event: MouseEvent): Promise<void> {
  const target = event.target as HTMLElement;

  if (!(target instanceof HTMLButtonElement)) return;

  const id = Number(target.dataset.id);
  const action = target.dataset.action;

  if (!id || !action) return;

  if (action === "details") {
    await showDetails(id);
  }

  if (action === "edit") {
    await startEdit(id);
  }

  if (action === "delete") {
    await removeItem(id);
  }
}

async function showDetails(id: number): Promise<void> {
  try {
    if (currentView === "posts") {
      const post = await getPostWithAuthor(id);
      const postComments = await getCommentsWithUsers(id);
      renderPostDetails(post, postComments);
      return;
    }

    if (currentView === "users") {
      const user = await getUserById(id);
      renderUserDetails(user);
      return;
    }

    const comment = await getCommentById(id);

    let post;
    let user;

    try {
      post = await getPostWithAuthor(comment.postId);
      user = await getUserById(comment.userId);
    } catch {
      // Якщо пов'язані дані не знайдено, сам коментар все одно показуємо.
    }

    renderCommentDetails(comment, post, user);
  } catch (err) {
    showError(err as ApiError);
  }
}

async function startEdit(id: number): Promise<void> {
  clearErrors();
  hideDetails();

  try {
    editingId = id;
    setEditMode(true);

    if (currentView === "posts") {
      const post = posts.find((item) => item.id === id) ?? await getPostWithAuthor(id);
      fillPostForm(post);
      return;
    }

    if (currentView === "users") {
      const user = users.find((item) => item.id === id) ?? await getUserById(id);
      fillUserForm(user);
      return;
    }

    const comment = comments.find((item) => item.id === id) ?? await getCommentById(id);
    fillCommentForm(comment);
  } catch (err) {
    showError(err as ApiError);
  }
}

async function removeItem(id: number): Promise<void> {
  const text =
    currentView === "posts"
      ? "Видалити цей пост?"
      : currentView === "users"
      ? "Видалити цього користувача?"
      : "Видалити цей коментар?";

  if (!confirm(text)) return;

  try {
    if (currentView === "posts") {
      await deletePost(id);
      showNotice("Пост видалено!");
    }

    if (currentView === "users") {
      await deleteUser(id);
      showNotice("Користувача видалено!");
    }

    if (currentView === "comments") {
      await deleteComment(id);
      showNotice("Коментар видалено!");
    }

    await loadDictionaries();
    await loadCurrentView();
  } catch (err) {
    showError(err as ApiError);
  }
}

function cancelEditing(): void {
  editingId = null;
  resetForm();
  clearErrors();
  hideDetails();
  setEditMode(false);
}

function validateCurrentForm(): boolean {
  if (currentView === "posts") {
    const dto = getPostFormData();

    if (dto.title.length < 3) {
      showFieldError("titleInput", "Заголовок має містити мінімум 3 символи");
      return false;
    }

    if (dto.title.length > 80) {
      showFieldError("titleInput", "Заголовок має містити максимум 80 символів");
      return false;
    }

    if (!dto.category) {
      showFieldError("categorySelect", "Оберіть категорію");
      return false;
    }

    if (dto.body.length < 5) {
      showFieldError("bodyInput", "Текст має містити мінімум 5 символів");
      return false;
    }

    if (dto.body.length > 500) {
      showFieldError("bodyInput", "Текст має містити максимум 500 символів");
      return false;
    }

    if (dto.author.length < 2) {
      showFieldError("authorInput", "Автор має містити мінімум 2 символи");
      return false;
    }

    if (!dto.userId) {
      showFieldError("postUserSelect", "Оберіть користувача");
      return false;
    }

    return true;
  }

  if (currentView === "users") {
    const dto = getUserFormData();

    if (dto.name.length < 2) {
      showFieldError("userNameInput", "Ім’я має містити мінімум 2 символи");
      return false;
    }

    if (dto.name.length > 60) {
      showFieldError("userNameInput", "Ім’я має містити максимум 60 символів");
      return false;
    }

    if (!dto.email.includes("@")) {
      showFieldError("userEmailInput", "Введіть коректний email");
      return false;
    }

    if (dto.email.length > 100) {
      showFieldError("userEmailInput", "Email має містити максимум 100 символів");
      return false;
    }

    return true;
  }

  const dto = getCommentFormData();

  if (dto.text.length < 2) {
    showFieldError("commentTextInput", "Коментар має містити мінімум 2 символи");
    return false;
  }

  if (dto.text.length > 300) {
    showFieldError("commentTextInput", "Коментар має містити максимум 300 символів");
    return false;
  }

  if (!dto.postId) {
    showFieldError("commentPostSelect", "Оберіть пост");
    return false;
  }

  if (!dto.userId) {
    showFieldError("commentUserSelect", "Оберіть користувача");
    return false;
  }

  return true;
}