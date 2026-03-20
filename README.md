# co.lok.kan

> Temukan workspace terbaik di Jakarta — cek WiFi, colokan, dan noise level sebelum datang.

A community-powered PWA for Jakarta's digital nomad scene. Verify and discover work-friendly cafes with real data on WiFi speed, outlet availability, and noise levels.

## Quick Start

No build step needed — plain HTML/JS/CSS.

```bash
# Python
python3 -m http.server 8080

# or Node
npx serve .
```

Open [http://localhost:8080](http://localhost:8080).

## Features

- Map and list view of work-friendly cafes across Jakarta
- Filter by WiFi speed, plug availability, noise level
- Submit community speed reports with screenshot verification
- Achievement badge system for active contributors
- Fully offline-capable PWA (installable on mobile)

## Stack

| | |
|---|---|
| Frontend | Vanilla HTML/CSS/JS |
| Maps | Google Maps JavaScript API + Places API |
| Hosting | Netlify |
| PWA | Web App Manifest + Service Worker |

## Project Structure

```
colokkan-app/
├── index.html         # App shell — all views
├── src/app.js         # All logic
├── src/styles/        # Design system + component styles
├── sw.js              # Service worker
├── manifest.json      # PWA manifest
└── netlify.toml       # Security headers + caching
```

See [AGENTS.md](./AGENTS.md) for full technical documentation, data model, and contribution guidelines.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
