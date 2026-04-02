# co.lok.kan

> Temukan workspace terbaik di Jakarta — cek WiFi, colokan, dan noise level sebelum datang.

A community-powered PWA for Jakarta's digital nomad scene. Verify and discover work-friendly cafes with real data on WiFi speed, outlet availability, and noise levels, then decide where to go right now using trust, forecast, and optional travel distance.

## Quick Start

No build step needed — plain HTML/JS/CSS.

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Open [http://localhost:8080](http://localhost:8080) for plain static preview.

For the full function-backed experience:

```bash
npx netlify dev --port 8888
```

Then open `http://127.0.0.1:8888/index.html`.

## Features

- Secure Google Maps view with restricted browser key fallback to local radar
- `Go Now` decision card that combines work mode, confidence, freshness, forecast, and optional travel distance
- Time-aware workability forecast from approved report windows
- Filter by WiFi speed, plug availability, noise level
- Submit community speed reports with screenshot verification and observed-time capture
- Achievement badge system for active contributors
- Fully offline-capable PWA (installable on mobile)

## Stack

| | |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Maps | Google Maps JavaScript API (render only) + local SVG radar fallback |
| Data | Netlify Functions + Supabase-ready schema |
| Hosting | Netlify |
| PWA | Web App Manifest + Service Worker |

## Map Setup

To enable embedded Google Maps in production without putting sensitive Google APIs in the browser flow:

- set `GOOGLE_MAPS_BROWSER_KEY` in Netlify
- restrict that key by exact HTTP referrers for your production domains
- enable only `Maps JavaScript API` on that browser key
- keep Places, Geocoding, and any other sensitive enrichment server-side if you add them later

If `GOOGLE_MAPS_BROWSER_KEY` is missing, the app automatically falls back to the built-in radar map.

## Project Structure

```
colokkan-app/
├── index.html         # App shell — all views
├── netlify/functions/ # Public config + reports/moderation backend
├── shared/            # Shared seed data
├── src/app.js         # All logic
├── src/styles/        # Design system + component styles
├── sw.js              # Service worker
├── manifest.json      # PWA manifest
├── db/schema.sql      # Supabase schema
└── netlify.toml       # Security headers + caching
```

See [AGENTS.md](./AGENTS.md) for full technical documentation, data model, and contribution guidelines.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
