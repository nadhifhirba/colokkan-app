# AGENTS.md — co.lok.kan

Agent Readiness Level: L5
Last Updated: 2026-03-21

---

## Project Overview

**co.lok.kan** is a Vanilla JS Progressive Web App (PWA) that helps Jakarta's digital nomad community find the best cafes and coworking spaces for remote work. Users can check WiFi speed, power outlet availability, and noise levels before heading out — all verified by the community.

**Name origin:** "colokkan" = Indonesian for "plug it in" — a nod to the eternal hunt for power outlets.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JavaScript (no framework) |
| Maps | Google Maps JavaScript API + Places API |
| Styling | Custom CSS (brutalist design system, JetBrains Mono) |
| PWA | Web App Manifest + Service Worker |
| Hosting | Netlify |
| Version Control | GitHub (`nadhifhirba/colokkan-app`) |

---

## How to Run Locally

No build step required. This is plain HTML/JS/CSS.

```bash
# Option 1: Python simple server
python3 -m http.server 8080
# Then open: http://localhost:8080

# Option 2: Node.js serve
npx serve .
# Then open: http://localhost:3000

# Option 3: VS Code Live Server extension
# Right-click index.html → Open with Live Server
```

> Note: Google Maps API requires a live domain or localhost to function. The API key in `index.html` is a browser-restricted key for development.

---

## Directory Structure

```
colokkan-app/
├── index.html          # Single-page app shell — all views live here
├── manifest.json       # PWA manifest (icons, theme, display mode)
├── sw.js               # Service worker — caches core assets for offline
├── netlify.toml        # Netlify config: security headers, caching rules
├── robots.txt          # SEO: allow all crawlers
├── sitemap.xml         # SEO: single-URL sitemap
├── icon-192.png        # PWA icon (192×192)
├── icon-512.png        # PWA icon (512×512)
├── AGENTS.md           # This file
├── CLAUDE.md           # Claude Code project context
└── src/
    ├── app.js          # All JavaScript logic (state, maps, UI, events)
    └── styles/
        └── global.css  # All CSS (design tokens, components, layout)
```

---

## Key Files and What They Do

### `index.html`
The entire app is a single HTML file with multiple view sections toggled via JS:
- **#radar-view** — main view with Map tab + List tab
- **#detail-view** — individual cafe detail page
- **#contribute-view** — form for submitting a WiFi speed report
- **#profile-view** — user profile with achievement badges
- **#filter-modal** — overlay for filtering by WiFi, plugs, noise

### `src/app.js`
All application logic in one file:
- `Cafes[]` — static seed data (12 real Jakarta cafes with factual coordinates)
- `initMap()` — initialises Google Maps, fetches live Places API data
- `fetchNearbyCafes()` — pulls nearby cafes from Places API, updates `Cafes[]`
- `renderList()` / `renderMarkers()` — re-renders UI based on current filters + search
- `handleFormSubmit()` — validates and submits a speed report (with Indonesian error messages)
- Navigation functions: `showRadar()`, `showContribute()`, `showProfile()`, `showDetail()`

### `src/styles/global.css`
Design tokens and component classes:
- CSS custom properties for the full color palette and spacing scale
- Brutalist component styles: `.btn`, `.card`, `.badge`, `.modal`, `.list-item`
- Focus-visible states for full keyboard navigation support

### `sw.js`
Caches `/`, `/index.html`, `/src/styles/global.css`, `/src/app.js` on install. Falls back to network for uncached requests.

### `netlify.toml`
Sets security headers on all routes: `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Content-Security-Policy`. Also controls caching for `sw.js` and `manifest.json`.

---

## How to Add a New Coworking Space

Edit the `Cafes` array in `/Users/malka/colokkan-app/src/app.js`:

```js
{
    id: "factual_13",           // Unique ID, increment factual_N
    name: "Your Cafe Name",     // Full display name
    lat: -6.2200,               // Latitude (use Google Maps to get coords)
    lng: 106.8300,              // Longitude
    neighborhood: "Menteng",    // Jakarta neighborhood/area name
    wifi: 60,                   // Estimated WiFi speed in Mbps
    plugs: "Plenty at tables",  // Description of outlet availability
    noise: "Quiet",             // Noise level description
    rating: 4.5,                // Google Maps rating (0–5)
    address: "Jl. Example No. 1, Menteng"  // Full street address
}
```

The new entry will automatically appear in the List view and on the Map.

---

## Known Limitations

1. **WiFi data is mocked** — speeds are randomly generated when loaded from the Places API. Community verification flow is UI-complete but not yet persisted to a backend.
2. **No auth/backend** — profile data is hardcoded. Reports are not stored anywhere.
3. **Google Maps API key exposed in HTML** — it's a browser-restricted key, but should eventually move to a Netlify environment variable and be served via a backend proxy.
4. **OCR is simulated** — the speedtest screenshot upload UI exists but the "62 Mbps detected" response is a setTimeout mock, not real OCR.
5. **Single-city scope** — currently only covers Jakarta (South + Central + North + West).
6. **No offline map tiles** — the service worker caches the app shell but not Google Maps tiles.

---

## Contribution Guidelines

1. **No framework** — keep it Vanilla JS. No React, Vue, or bundlers.
2. **One file per concern** — logic in `app.js`, styles in `global.css`, markup in `index.html`.
3. **Design tokens** — always use CSS custom properties from `:root` for colors and spacing. Don't hardcode hex values in new code.
4. **Indonesian-first copy** — all user-facing strings should be in Bahasa Indonesia (or bilingual). Error messages should have personality.
5. **Test PWA criteria** — after changes, verify: manifest is valid, service worker registers, app is installable, works offline (app shell at minimum).
6. **Security** — no new external script sources without updating the CSP in `netlify.toml`.
7. **Accessibility** — all interactive elements must have keyboard focus states (`:focus-visible`) and `aria-label` where the visible label is insufficient.
