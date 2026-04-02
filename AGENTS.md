# AGENTS.md — co.lok.kan

Agent Readiness Level: L5
Last Updated: 2026-04-02

---

## Project Overview

**co.lok.kan** is a Vanilla JS Progressive Web App (PWA) that helps Jakarta's digital nomad community find the best cafes and coworking spaces for remote work. Users can check WiFi speed, power outlet availability, and noise levels before heading out — all verified by the community.

**Name origin:** "colokkan" = Indonesian for "plug it in" — a nod to the eternal hunt for power outlets.

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | Vanilla HTML/CSS/JavaScript (no framework) |
| Maps | Google Maps JavaScript API (render only) + local SVG radar fallback |
| Styling | Custom CSS (brutalist design system, JetBrains Mono) |
| PWA | Web App Manifest + Service Worker |
| Hosting | Netlify |
| Backend | Netlify Functions + Supabase-ready schema |
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

# Option 3: Netlify Functions + map config
npx netlify dev --port 8888
# Then open: http://127.0.0.1:8888/index.html
```

> Note: Google Maps now loads via `public-config` and `GOOGLE_MAPS_BROWSER_KEY`, not a hardcoded client key in `index.html`.

---

## Directory Structure

```
colokkan-app/
├── index.html          # Single-page app shell — all views live here
├── manifest.json       # PWA manifest (icons, theme, display mode)
├── sw.js               # Service worker — caches core assets for offline
├── netlify.toml        # Netlify config: security headers, caching rules
├── netlify/functions/  # Public config + report/moderation endpoints
├── shared/             # Shared seed cafe data
├── db/schema.sql       # Supabase schema for cafes, reports, and review events
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
- `seedCafes` — shared seed data for the fallback path
- `renderList()` / `renderAreaGrid()` / `updateMapExperience()` — re-render ranking, area view, and map/radar
- `renderGoNowCard()` — current-time recommendation layer using mode, confidence, forecast, and optional distance
- `renderForecastCard()` — time-aware forecast detail derived from approved reports
- `handleFormSubmit()` — validates and submits a community report, including observed time
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

Add it to `/Users/malka/colokkan-app/shared/seed-cafes.js` for the seed fallback path, then sync into Supabase via `get-cafes`.

---

## Known Limitations

1. **Supabase not wired live in every environment yet** — the local app still falls back to seed data unless the function env vars are set.
2. **Admin review auth is token-based in v1** — not full user/admin auth yet.
3. **OCR is still simulated** — screenshot upload is persisted, but no extraction pipeline is running.
4. **Forecast quality depends on approved data density** — the model is real, but early slots will be sparse.
5. **Single-city scope** — currently focused on Jakarta.
6. **No offline map tiles** — the service worker caches the app shell, not Google Maps tiles.

---

## Contribution Guidelines

1. **No framework** — keep it Vanilla JS. No React, Vue, or bundlers.
2. **One file per concern** — logic in `app.js`, styles in `global.css`, markup in `index.html`.
3. **Design tokens** — always use CSS custom properties from `:root` for colors and spacing. Don't hardcode hex values in new code.
4. **Indonesian-first copy** — all user-facing strings should be in Bahasa Indonesia (or bilingual). Error messages should have personality.
5. **Test PWA criteria** — after changes, verify: manifest is valid, service worker registers, app is installable, works offline (app shell at minimum).
6. **Security** — no new external script sources without updating the CSP in `netlify.toml`.
7. **Accessibility** — all interactive elements must have keyboard focus states (`:focus-visible`) and `aria-label` where the visible label is insufficient.
