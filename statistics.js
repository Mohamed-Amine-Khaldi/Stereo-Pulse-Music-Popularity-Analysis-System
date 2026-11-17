/* =========================================================
   statistics.js — statistics.html only
   Requires Chart.js (loaded via CDN in statistics.html).
   ========================================================= */

let barChartInstance, pieChartInstance, lineChartInstance;

// Chart colors — written directly here (matching base.css) since the CSS
// no longer uses CSS variables. If you change a color in base.css, update
// the matching line below too so the charts stay in sync.
function getThemeColors() {
  return {
    amber: "#ffb454",
    cyan: "#34e0e0",
    text: "#cf9ab5",
    border: "#2a3268",
  };
}

function palette(n, colors) {
  const base = [colors.cyan, colors.amber, "#7c8cff", "#ff7ab8", "#7af0a0", "#ffd166"];
  const out = [];
  for (let i = 0; i < n; i++) out.push(base[i % base.length]);
  return out;
}

function commonAxisOptions(colors, yMax) {
  return {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { ticks: { color: colors.text }, grid: { color: colors.border } },
      y: { ticks: { color: colors.text }, grid: { color: colors.border }, beginAtZero: true, max: yMax },
    },
    plugins: { legend: { labels: { color: colors.text } } },
  };
}

/* ---------- filter toolbar (Business requirement: data filtering) ---------- */
function getFilteredTracks() {
  const genre = document.getElementById("st-genre-filter").value;
  const all = getAllTracks();
  return genre === "all" ? all : all.filter((t) => t.genres.includes(genre));
}

/* ---------- chart data builders ---------- */
function buildBarData(tracks) {
  // Only Top-Charts-eligible tracks appear here (Business Rule 1)
  const top = tracks
    .filter((t) => computeFlags(t).topCharts)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 10);
  return { labels: top.map((t) => t.title), data: top.map((t) => t.popularityScore) };
}

function buildPieData(tracks) {
  const counts = {};
  tracks.forEach((t) => t.genres.forEach((g) => (counts[g] = (counts[g] || 0) + 1)));
  return { labels: Object.keys(counts), data: Object.values(counts) };
}

function buildLineData(tracks) {
  const byYear = {};
  tracks.forEach((t) => {
    (byYear[t.releaseYear] = byYear[t.releaseYear] || []).push(t.popularityScore);
  });
  const years = Object.keys(byYear).map(Number).sort((a, b) => a - b);
  const avg = years.map((y) => Math.round(byYear[y].reduce((s, v) => s + v, 0) / byYear[y].length));
  return { labels: years, data: avg };
}

/* ---------- render (Business requirement: dynamic updates / real-time refresh) ---------- */
function renderCharts() {
  const tracks = getFilteredTracks();
  const colors = getThemeColors();

  const bar = buildBarData(tracks);
  if (barChartInstance) barChartInstance.destroy();
  barChartInstance = new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: { labels: bar.labels, datasets: [{ label: "Popularity score", data: bar.data, backgroundColor: colors.cyan, borderRadius: 6 }] },
    options: commonAxisOptions(colors, 100),
  });

  const pie = buildPieData(tracks);
  if (pieChartInstance) pieChartInstance.destroy();
  pieChartInstance = new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: { labels: pie.labels, datasets: [{ data: pie.data, backgroundColor: palette(pie.labels.length, colors) }] },
    options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: "bottom", labels: { color: colors.text } } } },
  });

  const line = buildLineData(tracks);
  if (lineChartInstance) lineChartInstance.destroy();
  lineChartInstance = new Chart(document.getElementById("lineChart"), {
    type: "line",
    data: {
      labels: line.labels,
      datasets: [{ label: "Avg popularity", data: line.data, borderColor: colors.amber, backgroundColor: "transparent", tension: 0.35, pointBackgroundColor: colors.amber }],
    },
    options: commonAxisOptions(colors, 100),
  });

  document.getElementById("chart-scope-note").textContent =
    document.getElementById("st-genre-filter").value === "all"
      ? `Showing all ${tracks.length} tracks.`
      : `Filtered to "${document.getElementById("st-genre-filter").value}" — ${tracks.length} tracks.`;
}

/* ---------- comparison panel (Business requirement: data comparison) ---------- */
function computeGenreStats(genre) {
  const tracks = getAllTracks().filter((t) => (genre === "all" ? true : t.genres.includes(genre)));
  const count = tracks.length;
  const avg = (key) => (count ? Math.round((tracks.reduce((s, t) => s + t[key], 0) / count) * 10) / 10 : 0);
  return { count, avgPopularity: avg("popularityScore"), avgStreams: avg("streamsMillions"), avgGrowth: avg("monthlyGrowthPercent") };
}

function fillCompareCard(elId, label, stats) {
  document.getElementById(elId).innerHTML = `
    <h3>${label === "all" ? "All Genres" : label}</h3>
    <div class="compare-row"><span>Tracks</span><span class="v">${stats.count}</span></div>
    <div class="compare-row"><span>Avg popularity</span><span class="v">${stats.avgPopularity}</span></div>
    <div class="compare-row"><span>Avg streams</span><span class="v">${stats.avgStreams}M</span></div>
    <div class="compare-row"><span>Avg monthly growth</span><span class="v">${stats.avgGrowth}%</span></div>
  `;
}

function renderComparison() {
  const a = document.getElementById("cmp-a").value;
  const b = document.getElementById("cmp-b").value;
  fillCompareCard("cmp-card-a", a, computeGenreStats(a));
  fillCompareCard("cmp-card-b", b, computeGenreStats(b));
}

/* ---------- setup ---------- */
function populateGenreSelects() {
  [document.getElementById("st-genre-filter"), document.getElementById("cmp-a"), document.getElementById("cmp-b")].forEach((select) => {
    GENRES.forEach((g) => {
      const opt = document.createElement("option");
      opt.value = g; opt.textContent = g;
      select.appendChild(opt);
    });
  });
  document.getElementById("cmp-b").value = GENRES[1] || "all";
}

document.addEventListener("DOMContentLoaded", function () {
  populateGenreSelects();
  renderCharts();
  renderComparison();

  document.getElementById("st-genre-filter").addEventListener("change", renderCharts);
  document.getElementById("st-reset").addEventListener("click", function () {
    document.getElementById("st-genre-filter").value = "all";
    renderCharts();
  });
  document.getElementById("cmp-a").addEventListener("change", renderComparison);
  document.getElementById("cmp-b").addEventListener("change", renderComparison);
});