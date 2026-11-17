/* =========================================================
   home.js — index.html only
   ========================================================= */

function getTopGenre(tracks) {
  const counts = {};
  tracks.forEach((t) => {
    t.genres.forEach((g) => {
      counts[g] = (counts[g] || 0) + 1;
    });
  });
  let top = "—", max = 0;
  Object.keys(counts).forEach((g) => {
    if (counts[g] > max) { max = counts[g]; top = g; }
  });
  return top;
}

function renderHomeStats() {
  const tracks = getAllTracks();
  const total = tracks.length;
  const avgPopularity = total
    ? Math.round(tracks.reduce((sum, t) => sum + t.popularityScore, 0) / total)
    : 0;
  const totalStreams = tracks.reduce((sum, t) => sum + t.streamsMillions, 0);
  const topGenre = getTopGenre(tracks);

  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-popularity").textContent = avgPopularity;
  document.getElementById("stat-genre").textContent = topGenre;
  document.getElementById("stat-streams").textContent = totalStreams.toLocaleString() + "M";
}

function renderFeaturedTracks() {
  const tracks = getAllTracks();
  const top3 = tracks
    .filter((t) => computeFlags(t).topCharts)
    .sort((a, b) => b.popularityScore - a.popularityScore)
    .slice(0, 3);

  const wrap = document.getElementById("featured-tracks");
  wrap.innerHTML = "";

  top3.forEach((t, i) => {
    const flags = computeFlags(t);
    const card = document.createElement("div");
    card.className = "card track-card";
    card.innerHTML = `
      <span class="rank">#${i + 1} ON THE CHARTS</span>
      <h3>${t.title}</h3>
      <p class="artist">${t.artist}</p>
      <div class="meter">
        <div class="meter-track"><div class="meter-fill" style="width:${t.popularityScore}%"></div></div>
        <span class="meter-value">${t.popularityScore}</span>
      </div>
      <div class="badges">
        <span class="badge badge-cyan">${t.genres.join(" / ")}</span>
        ${flags.trending ? '<span class="badge badge-amber">🔥 Trending</span>' : ""}
      </div>
    `;
    wrap.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderHomeStats();
  renderFeaturedTracks();
});
