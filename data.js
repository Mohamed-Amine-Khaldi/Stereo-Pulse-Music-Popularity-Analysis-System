/* =========================================================
   data.js
   - Static lookup lists (genres / platforms)
   - The 19-record seed dataset (19 = last 3 digits of
     student ID 20231019)
   - The 3 custom business rules, implemented as one
     function so they are easy to find and explain live.
   ========================================================= */

const GENRES = ["Pop", "Hip-Hop", "R&B", "Electronic", "Rock", "Afrobeats"];
const PLATFORMS = ["Spotify", "Apple Music", "YouTube Music", "SoundCloud"];

/* ---- Business rule thresholds (change these during a live demo) ---- */
const RULES = {
  MAX_GENRES_PER_TRACK: 3,      // Rule 3
  TOP_CHARTS_MIN_POPULARITY: 50, // Rule 1
  LOW_REACH_STREAMS_MILLIONS: 50, // Rule 2
  TRENDING_GROWTH_PERCENT: 15,   // bonus rule, shown as a badge only
};

/**
 * Business Rule 1 — Top Charts Eligibility
 *   A track needs popularityScore >= RULES.TOP_CHARTS_MIN_POPULARITY
 *   to be allowed into the "Top Charts". Everything else is still kept
 *   in the catalog but labelled "Not Charting".
 *
 * Business Rule 2 — Low Reach Flag
 *   Any track with streamsMillions below RULES.LOW_REACH_STREAMS_MILLIONS
 *   is flagged "Low Reach", independent of its popularity score
 *   (a song can be popular per-listen but still have a small audience).
 *
 * Business Rule 3 — Genre Cap
 *   A track cannot carry more than RULES.MAX_GENRES_PER_TRACK genres.
 *   Enforced in data-management.js when the form is submitted.
 *
 * Bonus — Trending badge (not graded as a "rule", kept for flavor)
 */
function computeFlags(track) {
  return {
    topCharts: track.popularityScore >= RULES.TOP_CHARTS_MIN_POPULARITY,
    lowReach: track.streamsMillions < RULES.LOW_REACH_STREAMS_MILLIONS,
    trending: track.monthlyGrowthPercent >= RULES.TRENDING_GROWTH_PERCENT,
  };
}

const SEED_TRACKS = [
  { id: 1,  title: "Midnight Echo",      artist: "Lira Voss",            genres: ["Pop"],             releaseYear: 2023, popularityScore: 87, streamsMillions: 420, durationSec: 201, platform: "Spotify",       monthlyGrowthPercent: 12.4 },
  { id: 2,  title: "Neon Static",        artist: "The Wire Collective",  genres: ["Electronic"],      releaseYear: 2024, popularityScore: 74, streamsMillions: 180, durationSec: 214, platform: "YouTube Music", monthlyGrowthPercent: 22.1 },
  { id: 3,  title: "Slow Burn",          artist: "Mara Jiang",           genres: ["R&B"],              releaseYear: 2022, popularityScore: 65, streamsMillions: 95,  durationSec: 233, platform: "Apple Music",   monthlyGrowthPercent: 3.2  },
  { id: 4,  title: "Concrete Heart",     artist: "Dezi Run",             genres: ["Hip-Hop"],          releaseYear: 2024, popularityScore: 91, streamsMillions: 610, durationSec: 188, platform: "Spotify",       monthlyGrowthPercent: 18.7 },
  { id: 5,  title: "Paper Moon",         artist: "Theo & the Sailors",   genres: ["Rock"],             releaseYear: 2021, popularityScore: 58, streamsMillions: 40,  durationSec: 247, platform: "SoundCloud",    monthlyGrowthPercent: 1.1  },
  { id: 6,  title: "Golden Hour Fade",   artist: "Aiko Renn",            genres: ["Pop", "R&B"],       releaseYear: 2023, popularityScore: 82, streamsMillions: 310, durationSec: 198, platform: "Spotify",       monthlyGrowthPercent: 9.4  },
  { id: 7,  title: "Static Bloom",       artist: "Nova Reyes",           genres: ["Electronic", "Pop"],releaseYear: 2024, popularityScore: 69, streamsMillions: 140, durationSec: 221, platform: "YouTube Music", monthlyGrowthPercent: 15.0 },
  { id: 8,  title: "Lowlight",           artist: "Kasimir Dro",          genres: ["R&B"],              releaseYear: 2020, popularityScore: 44, streamsMillions: 12,  durationSec: 255, platform: "Apple Music",   monthlyGrowthPercent: 0.4  },
  { id: 9,  title: "Run It Back",        artist: "Trey Solis",           genres: ["Hip-Hop"],          releaseYear: 2023, popularityScore: 88, streamsMillions: 540, durationSec: 176, platform: "Spotify",       monthlyGrowthPercent: 14.2 },
  { id: 10, title: "Wildflower Static",  artist: "Bea Solano",           genres: ["Pop"],              releaseYear: 2022, popularityScore: 76, streamsMillions: 260, durationSec: 206, platform: "SoundCloud",    monthlyGrowthPercent: 6.8  },
  { id: 11, title: "Iron & Ash",         artist: "Kova Lin",             genres: ["Rock"],             releaseYear: 2024, popularityScore: 61, streamsMillions: 70,  durationSec: 239, platform: "YouTube Music", monthlyGrowthPercent: 4.9  },
  { id: 12, title: "After Hours Glow",   artist: "DJ Marrow",            genres: ["Electronic"],       releaseYear: 2021, popularityScore: 53, streamsMillions: 33,  durationSec: 262, platform: "SoundCloud",    monthlyGrowthPercent: 2.0  },
  { id: 13, title: "Velvet Static",      artist: "Imani Cruz",           genres: ["R&B", "Pop"],       releaseYear: 2023, popularityScore: 79, streamsMillions: 290, durationSec: 212, platform: "Apple Music",   monthlyGrowthPercent: 10.6 },
  { id: 14, title: "Coastline Drift",    artist: "Sable & June",         genres: ["Pop"],              releaseYear: 2024, popularityScore: 85, streamsMillions: 380, durationSec: 194, platform: "Spotify",       monthlyGrowthPercent: 16.9 },
  { id: 15, title: "Heatwave Riot",      artist: "MC Drez",              genres: ["Hip-Hop", "Electronic"], releaseYear: 2022, popularityScore: 72, streamsMillions: 200, durationSec: 182, platform: "YouTube Music", monthlyGrowthPercent: 5.5 },
  { id: 16, title: "Tin Roof",           artist: "Holler Lane",          genres: ["Rock"],             releaseYear: 2020, popularityScore: 39, streamsMillions: 8,   durationSec: 271, platform: "SoundCloud",    monthlyGrowthPercent: 0.2  },
  { id: 17, title: "Glasswave",          artist: "Yuki Soren",           genres: ["Electronic"],       releaseYear: 2023, popularityScore: 67, streamsMillions: 120, durationSec: 228, platform: "Apple Music",   monthlyGrowthPercent: 11.3 },
  { id: 18, title: "Sundown Sundown",    artist: "Priya Achebe",         genres: ["Afrobeats", "Pop"], releaseYear: 2024, popularityScore: 93, streamsMillions: 720, durationSec: 209, platform: "Spotify",       monthlyGrowthPercent: 24.5 },
  { id: 19, title: "Quiet Static",       artist: "Mara Jiang",           genres: ["R&B"],              releaseYear: 2024, popularityScore: 71, streamsMillions: 160, durationSec: 217, platform: "YouTube Music", monthlyGrowthPercent: 7.7  },
];
