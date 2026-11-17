/* =========================================================
   search.js — search.html only
   ========================================================= */

function populateFilterOptions() {
  const genreSelect = document.getElementById("s-genre");
  GENRES.forEach((g) => {
    const opt = document.createElement("option");
    opt.value = g; opt.textContent = g;
    genreSelect.appendChild(opt);
  });

  const platformSelect = document.getElementById("s-platform");
  PLATFORMS.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p; opt.textContent = p;
    platformSelect.appendChild(opt);
  });
}

function applySort(tracks, sortKey) {
  const sorted = [...tracks];
  switch (sortKey) {
    case "popularity-asc": sorted.sort((a, b) => a.popularityScore - b.popularityScore); break;
    case "streams-desc": sorted.sort((a, b) => b.streamsMillions - a.streamsMillions); break;
    case "year-desc": sorted.sort((a, b) => b.releaseYear - a.releaseYear); break;
    case "title-asc": sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
    default: sorted.sort((a, b) => b.popularityScore - a.popularityScore); // popularity-desc
  }
  return sorted;
}

function runSearch() {
  const query = document.getElementById("s-query").value.trim().toLowerCase();
  const genre = document.getElementById("s-genre").value;
  const platform = document.getElementById("s-platform").value;
  const sortKey = document.getElementById("s-sort").value;

  let results = getAllTracks().filter((t) => {
    const matchesQuery = !query || t.title.toLowerCase().includes(query) || t.artist.toLowerCase().includes(query);
    const matchesGenre = genre === "all" || t.genres.includes(genre);
    const matchesPlatform = platform === "all" || t.platform === platform;
    return matchesQuery && matchesGenre && matchesPlatform;
  });

  results = applySort(results, sortKey);
  renderResults(results);
}

function renderResults(tracks) {
  const tbody = document.getElementById("results-table-body");
  const wrap = document.getElementById("results-table-wrap");
  const empty = document.getElementById("empty-state");
  const count = document.getElementById("results-count");

  count.textContent = `${tracks.length} result${tracks.length === 1 ? "" : "s"}`;

  if (tracks.length === 0) {
    wrap.style.display = "none";
    empty.style.display = "block";
    return;
  }
  wrap.style.display = "block";
  empty.style.display = "none";

  tbody.innerHTML = tracks.map((t) => {
    const flags = computeFlags(t);
    return `
      <tr>
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
        <td>${t.platform}</td>
        <td>${flags.topCharts ? '<span class="badge badge-cyan">Top Charts</span>' : '<span class="badge badge-muted">Not Charting</span>'}</td>
      </tr>
    `;
  }).join("");
}

document.addEventListener("DOMContentLoaded", function () {
  populateFilterOptions();

  document.getElementById("filter-form").addEventListener("submit", function (e) {
    e.preventDefault();
    runSearch();
  });

  ["s-query", "s-genre", "s-platform", "s-sort"].forEach((id) => {
    document.getElementById(id).addEventListener("input", runSearch);
  });

  document.getElementById("s-reset").addEventListener("click", function () {
    document.getElementById("filter-form").reset();
    runSearch();
  });

  runSearch();
});
