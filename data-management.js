/* =========================================================
   data-management.js — data-management.html only
   Implements: Add, Edit, Delete, plus live enforcement of
   Business Rule 3 (max genres per track).
   ========================================================= */

let editingId = null;

/* ---------- genre checkboxes ---------- */
function renderGenreCheckboxes() {
  const grid = document.getElementById("genre-grid");
  grid.innerHTML = "";
  GENRES.forEach((g) => {
    const wrap = document.createElement("label");
    wrap.className = "checkbox-row";
    wrap.innerHTML = `<input type="checkbox" class="genre-checkbox" value="${g}"> ${g}`;
    grid.appendChild(wrap);
  });

  grid.addEventListener("change", function (e) {
    if (!e.target.classList.contains("genre-checkbox")) return;
    const checked = grid.querySelectorAll(".genre-checkbox:checked");
    // Business Rule 3 — enforced live, the moment a 4th box is ticked
    if (checked.length > RULES.MAX_GENRES_PER_TRACK) {
      e.target.checked = false;
      showError(`A track can only have up to ${RULES.MAX_GENRES_PER_TRACK} genres (Business Rule 3).`);
    }
  });
}

function getSelectedGenres() {
  return Array.from(document.querySelectorAll(".genre-checkbox:checked")).map((cb) => cb.value);
}

function setSelectedGenres(genresArr) {
  document.querySelectorAll(".genre-checkbox").forEach((cb) => {
    cb.checked = genresArr.includes(cb.value);
  });
}

/* ---------- platform select ---------- */
function renderPlatformOptions() {
  const select = document.getElementById("f-platform");
  select.innerHTML = PLATFORMS.map((p) => `<option value="${p}">${p}</option>`).join("");
}

/* ---------- form helpers ---------- */
function showError(message) {
  const el = document.getElementById("form-error");
  el.textContent = message;
  el.classList.add("show");
}
function clearErrorMessage() {
  const el = document.getElementById("form-error");
  el.textContent = "";
  el.classList.remove("show");
}

function clearForm() {
  editingId = null;
  document.getElementById("track-form").reset();
  setSelectedGenres([]);
  clearErrorMessage();
  document.getElementById("editing-banner").classList.remove("show");
  document.getElementById("f-submit").textContent = "Add Track";
}

function fillFormForEdit(track) {
  editingId = track.id;
  document.getElementById("f-title").value = track.title;
  document.getElementById("f-artist").value = track.artist;
  document.getElementById("f-year").value = track.releaseYear;
  document.getElementById("f-popularity").value = track.popularityScore;
  document.getElementById("f-streams").value = track.streamsMillions;
  document.getElementById("f-duration").value = track.durationSec;
  document.getElementById("f-platform").value = track.platform;
  document.getElementById("f-growth").value = track.monthlyGrowthPercent;
  setSelectedGenres(track.genres);
  clearErrorMessage();
  document.getElementById("editing-banner").classList.add("show");
  document.getElementById("f-submit").textContent = "Update Track";
  document.getElementById("track-form").scrollIntoView({ behavior: "smooth", block: "start" });
}

function validateTrackInput(data) {
  if (!data.title || !data.artist) return "Title and artist are required.";
  if (data.genres.length === 0) return "Select at least one genre.";
  if (data.genres.length > RULES.MAX_GENRES_PER_TRACK) return `Max ${RULES.MAX_GENRES_PER_TRACK} genres allowed.`;
  if (data.popularityScore < 0 || data.popularityScore > 100) return "Popularity score must be between 0 and 100.";
  if (data.releaseYear < 1950 || data.releaseYear > 2026) return "Enter a realistic release year.";
  if (data.streamsMillions < 0) return "Streams cannot be negative.";
  if (data.durationSec <= 0) return "Duration must be greater than 0.";
  return null;
}

/* ---------- table render ---------- */
function statusBadges(track) {
  const flags = computeFlags(track);
  let html = "";
  html += flags.topCharts
    ? '<span class="badge badge-cyan">Top Charts</span>'
    : '<span class="badge badge-muted">Not Charting</span>';
  if (flags.lowReach) html += '<span class="badge badge-danger">Low Reach</span>';
  if (flags.trending) html += '<span class="badge badge-amber">Trending</span>';
  return html;
}

function renderTable() {
  const tracks = getAllTracks();
  const tbody = document.getElementById("track-table-body");
  tbody.innerHTML = "";

  tracks.forEach((t) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${t.title}</strong></td>
      <td>${t.artist}</td>
      <td>${t.genres.join(", ")}</td>
      <td>${t.releaseYear}</td>
      <td>
        <div class="meter">
          <div class="meter-track"><div class="meter-fill" style="width:${t.popularityScore}%"></div></div>
          <span class="meter-value">${t.popularityScore}</span>
        </div>
      </td>
      <td>${t.streamsMillions}M</td>
      <td class="badges-cell">${statusBadges(t)}</td>
      <td>
        <div class="row-actions">
          <button class="btn btn-ghost btn-sm" data-action="edit" data-id="${t.id}">Edit</button>
          <button class="btn btn-danger btn-sm" data-action="delete" data-id="${t.id}">Delete</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.getElementById("track-count").textContent = `${tracks.length} tracks`;
}

/* ---------- events ---------- */
function initForm() {
  renderGenreCheckboxes();
  renderPlatformOptions();

  document.getElementById("track-form").addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrorMessage();

    const data = {
      title: document.getElementById("f-title").value.trim(),
      artist: document.getElementById("f-artist").value.trim(),
      genres: getSelectedGenres(),
      releaseYear: parseInt(document.getElementById("f-year").value, 10),
      popularityScore: parseInt(document.getElementById("f-popularity").value, 10),
      streamsMillions: parseFloat(document.getElementById("f-streams").value),
      durationSec: parseInt(document.getElementById("f-duration").value, 10),
      platform: document.getElementById("f-platform").value,
      monthlyGrowthPercent: parseFloat(document.getElementById("f-growth").value),
    };

    const error = validateTrackInput(data);
    if (error) { showError(error); return; }

    if (editingId !== null) {
      updateTrack(editingId, data);
    } else {
      addTrack(data);
    }
    clearForm();
    renderTable();
  });

  document.getElementById("f-cancel").addEventListener("click", clearForm);

  // event delegation for edit / delete buttons
  document.getElementById("track-table-body").addEventListener("click", function (e) {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = parseInt(btn.dataset.id, 10);

    if (btn.dataset.action === "edit") {
      const track = getAllTracks().find((t) => t.id === id);
      if (track) fillFormForEdit(track);
    }

    if (btn.dataset.action === "delete") {
      const track = getAllTracks().find((t) => t.id === id);
      if (track && confirm(`Delete "${track.title}" by ${track.artist}? This cannot be undone.`)) {
        deleteTrack(id);
        renderTable();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initForm();
  renderTable();
});
