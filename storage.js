/* =========================================================
   storage.js
   Every read/write to localStorage goes through here.
   ========================================================= */

const STORAGE_KEY = "stereoPulse_tracks";
const NEXT_ID_KEY = "stereoPulse_nextId";

function seedIfEmpty() {
  if (localStorage.getItem(STORAGE_KEY) === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRACKS));
    localStorage.setItem(NEXT_ID_KEY, String(SEED_TRACKS.length + 1));
  }
}

function getAllTracks() {
  seedIfEmpty();
  return JSON.parse(localStorage.getItem(STORAGE_KEY));
}

function saveAllTracks(tracks) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tracks));
}

function nextId() {
  let id = parseInt(localStorage.getItem(NEXT_ID_KEY) || "1", 10);
  localStorage.setItem(NEXT_ID_KEY, String(id + 1));
  return id;
}

function addTrack(track) {
  const tracks = getAllTracks();
  track.id = nextId();
  tracks.push(track);
  saveAllTracks(tracks);
  return track;
}

function updateTrack(id, updates) {
  const tracks = getAllTracks();
  const idx = tracks.findIndex((t) => t.id === id);
  if (idx === -1) return null;
  tracks[idx] = { ...tracks[idx], ...updates, id };
  saveAllTracks(tracks);
  return tracks[idx];
}

function deleteTrack(id) {
  const tracks = getAllTracks().filter((t) => t.id !== id);
  saveAllTracks(tracks);
}

function resetToSeed() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TRACKS));
  localStorage.setItem(NEXT_ID_KEY, String(SEED_TRACKS.length + 1));
}
