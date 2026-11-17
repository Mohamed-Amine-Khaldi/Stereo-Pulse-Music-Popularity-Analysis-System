# Stereo Pulse — Music Popularity Analysis System

> **Web Programming Final Project**

---

## 📌 Project Overview
**Stereo Pulse** is a browser-based data visualization and cataloging application built entirely with vanilla **HTML, CSS, and JavaScript** (no backend server required)[cite: 7]. The application tracks a curated catalog of music tracks, allowing users to manage records, filter/search catalog data in real time, and explore insights through dynamic Chart.js visualizations.

---

## 🚀 Key Features & Pages
The project is structured into a flat multi-page architecture consisting of 5 core pages[cite: 7]:
1. **Home (`index.html`):** Displays live aggregated metrics (total tracks, average popularity, leading genre, total streams) and showcases top charting tracks[cite: 7].
2. **Data Management (`data-management.html`):** Full **CRUD** (Create, Read, Update, Delete) interface with live form validation and instant `localStorage` synchronization[cite: 7].
3. **Search (`search.html`):** Real-time live filtering by title, artist, genre, platform, and multiple sorting criteria[cite: 7].
4. **Statistics (`statistics.html`):** Interactive **Chart.js** dashboards featuring[cite: 7]:
   - Top charting tracks (Bar chart)
   - Genre distribution (Pie chart)
   - Average popularity by release year (Line chart)
   - Side-by-side genre comparison panel
5. **About (`about.html`):** System documentation and clear breakdown of implemented business rules[cite: 7].

---

## ⚙️ Custom Business Rules
Implemented via `data.js` and controlled by the `RULES` configuration object[cite: 7]:
* **Rule 1 (Top Charts Eligibility):** Tracks must meet or exceed a specific popularity threshold to qualify for top charts; otherwise, they are labeled *"Not Charting"*[cite: 7].
* **Rule 2 (Low Reach Flag):** Tracks with low stream counts are automatically flagged as *"Low Reach"* regardless of their popularity score[cite: 7].
* **Rule 3 (Genre Cap):** Enforces a strict validation limit on the maximum number of genres per track[cite: 7].
* **Bonus Rule (Trending Badge):** High-growth tracks receive a 🔥 Trending badge[cite: 7].

---

## 🛠️ Tech Stack & Architecture
* **Frontend:** HTML5, CSS3 (with CSS Custom Properties synced dynamically to charts), JavaScript (ES6 Modules).
* **Storage:** Browser `localStorage` (managed exclusively via `storage.js`)[cite: 7].
* **Libraries:** Chart.js (via CDN).

---

## 🏃‍♂️ How to Run Locally
Since this is a client-side static web application with no backend dependencies[cite: 7]:
1. Clone or download this repository.
2. Open `index.html` directly in any modern web browser, or run it using a local development server (such as VS Code **Live Server**).