/**
 * SnippetVault — app.js
 * Handles fetching, rendering, filtering, searching, adding and deleting snippets.
 * Relies on `sb` (Supabase client) from supabaseClient.js.
 */

const TABLE_NAME = "snippets";

// ---- State ----
let allSnippets = [];
let activeTag = null;

// ---- DOM references ----
const snippetGrid = document.getElementById("snippetGrid");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const searchInput = document.getElementById("searchInput");
const languageFilter = document.getElementById("languageFilter");
const tagFilterBar = document.getElementById("tagFilterBar");

const newSnippetBtn = document.getElementById("newSnippetBtn");
const snippetModal = document.getElementById("snippetModal");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const snippetForm = document.getElementById("snippetForm");
const modalTitle = document.getElementById("modalTitle");

const titleInput = document.getElementById("titleInput");
const languageInput = document.getElementById("languageInput");
const tagsInput = document.getElementById("tagsInput");
const codeInput = document.getElementById("codeInput");

const toast = document.getElementById("toast");

// ---- Init ----
document.addEventListener("DOMContentLoaded", () => {
  loadSnippets();

  newSnippetBtn.addEventListener("click", openModal);
  closeModalBtn.addEventListener("click", closeModal);
  cancelBtn.addEventListener("click", closeModal);
  snippetModal.addEventListener("click", (e) => {
    if (e.target === snippetModal) closeModal();
  });

  snippetForm.addEventListener("submit", handleFormSubmit);
  searchInput.addEventListener("input", renderFilteredSnippets);
  languageFilter.addEventListener("change", renderFilteredSnippets);
});

// ---- Data fetching ----
async function loadSnippets() {
  loadingState.classList.remove("hidden");
  emptyState.classList.add("hidden");

  const { data, error } = await sb
    .from(TABLE_NAME)
    .select("*")
    .order("created_at", { ascending: false });

  loadingState.classList.add("hidden");

  if (error) {
    showToast("Failed to load snippets. Check your Supabase config.", "error");
    console.error(error);
    return;
  }

  allSnippets = data || [];
  populateLanguageFilter();
  populateTagFilterBar();
  renderFilteredSnippets();
}

// ---- Rendering ----
function renderFilteredSnippets() {
  const query = searchInput.value.trim().toLowerCase();
  const language = languageFilter.value;

  const filtered = allSnippets.filter((snippet) => {
    const matchesQuery =
      !query ||
      snippet.title.toLowerCase().includes(query) ||
      snippet.code.toLowerCase().includes(query) ||
      (snippet.tags || []).some((tag) => tag.toLowerCase().includes(query));

    const matchesLanguage = !language || snippet.language === language;
    const matchesTag = !activeTag || (snippet.tags || []).includes(activeTag);

    return matchesQuery && matchesLanguage && matchesTag;
  });

  renderSnippetGrid(filtered);
}

function renderSnippetGrid(snippets) {
  snippetGrid.innerHTML = "";

  if (snippets.length === 0) {
    emptyState.classList.remove("hidden");
    return;
  }
  emptyState.classList.add("hidden");

  snippets.forEach((snippet) => {
    snippetGrid.appendChild(buildSnippetCard(snippet));
  });

  // Apply syntax highlighting after cards are in the DOM
  document.querySelectorAll("pre code").forEach((block) => {
    hljs.highlightElement(block);
  });
}

function buildSnippetCard(snippet) {
  const card = document.createElement("div");
  card.className = "snippet-card";

  const header = document.createElement("div");
  header.className = "snippet-card-header";

  const title = document.createElement("h3");
  title.className = "snippet-title";
  title.textContent = snippet.title;

  const langBadge = document.createElement("span");
  langBadge.className = "snippet-lang-badge";
  langBadge.textContent = snippet.language;

  header.appendChild(title);
  header.appendChild(langBadge);

  const codeWrapper = document.createElement("div");
  codeWrapper.className = "snippet-code-wrapper";
  const pre = document.createElement("pre");
  const code = document.createElement("code");
  code.className = `language-${snippet.language}`;
  code.textContent = snippet.code;
  pre.appendChild(code);
  codeWrapper.appendChild(pre);

  const footer = document.createElement("div");
  footer.className = "snippet-card-footer";

  const tagsWrap = document.createElement("div");
  tagsWrap.className = "snippet-tags";
  (snippet.tags || []).forEach((tag) => {
    const tagEl = document.createElement("span");
    tagEl.className = "snippet-tag";
    tagEl.textContent = tag;
    tagsWrap.appendChild(tagEl);
  });

  const actions = document.createElement("div");
  actions.className = "snippet-actions";

  const copyBtn = document.createElement("button");
  copyBtn.className = "btn btn-secondary";
  copyBtn.textContent = "Copy";
  copyBtn.addEventListener("click", () => copySnippet(snippet.code));

  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteSnippet(snippet.id));

  actions.appendChild(copyBtn);
  actions.appendChild(deleteBtn);

  footer.appendChild(tagsWrap);
  footer.appendChild(actions);

  card.appendChild(header);
  card.appendChild(codeWrapper);
  card.appendChild(footer);

  return card;
}

// ---- Filters ----
function populateLanguageFilter() {
  const languages = [...new Set(allSnippets.map((s) => s.language))].sort();
  const currentValue = languageFilter.value;

  languageFilter.innerHTML = '<option value="">All Languages</option>';
  languages.forEach((lang) => {
    const opt = document.createElement("option");
    opt.value = lang;
    opt.textContent = lang;
    languageFilter.appendChild(opt);
  });

  languageFilter.value = languages.includes(currentValue) ? currentValue : "";
}

function populateTagFilterBar() {
  const tagSet = new Set();
  allSnippets.forEach((s) => (s.tags || []).forEach((t) => tagSet.add(t)));

  tagFilterBar.innerHTML = "";
  if (tagSet.size === 0) return;

  [...tagSet].sort().forEach((tag) => {
    const pill = document.createElement("button");
    pill.type = "button";
    pill.className = "tag-pill" + (activeTag === tag ? " active" : "");
    pill.textContent = tag;
    pill.addEventListener("click", () => {
      activeTag = activeTag === tag ? null : tag;
      populateTagFilterBar();
      renderFilteredSnippets();
    });
    tagFilterBar.appendChild(pill);
  });
}

// ---- Create / Delete ----
async function handleFormSubmit(e) {
  e.preventDefault();

  const newSnippet = {
    title: titleInput.value.trim(),
    language: languageInput.value,
    tags: tagsInput.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    code: codeInput.value,
  };

  const { error } = await sb.from(TABLE_NAME).insert([newSnippet]);

  if (error) {
    showToast("Failed to save snippet.", "error");
    console.error(error);
    return;
  }

  showToast("Snippet saved!", "success");
  closeModal();
  snippetForm.reset();
  await loadSnippets();
}

async function deleteSnippet(id) {
  const confirmed = confirm("Delete this snippet? This cannot be undone.");
  if (!confirmed) return;

  const { error } = await sb.from(TABLE_NAME).delete().eq("id", id);

  if (error) {
    showToast("Failed to delete snippet.", "error");
    console.error(error);
    return;
  }

  showToast("Snippet deleted.", "success");
  await loadSnippets();
}

// ---- Utilities ----
function copySnippet(code) {
  navigator.clipboard
    .writeText(code)
    .then(() => showToast("Copied to clipboard!", "success"))
    .catch(() => showToast("Could not copy.", "error"));
}

function openModal() {
  modalTitle.textContent = "New Snippet";
  snippetModal.classList.remove("hidden");
  titleInput.focus();
}

function closeModal() {
  snippetModal.classList.add("hidden");
  snippetForm.reset();
}

let toastTimeout;
function showToast(message, type = "success") {
  clearTimeout(toastTimeout);
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toastTimeout = setTimeout(() => toast.classList.add("hidden"), 3000);
}
