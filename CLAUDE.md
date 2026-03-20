# CLAUDE.md — co.lok.kan

Project context for Claude Code and other AI agents.

## What This Is

co.lok.kan is a Vanilla JS PWA for finding work-friendly cafes in Jakarta. Community-verified WiFi speeds, outlet availability, and noise levels. No framework, no build step.

## Stack

- Plain HTML + CSS + JS (no bundler, no framework)
- Google Maps JavaScript API (Places API for live data)
- Netlify (hosting + headers config)
- JetBrains Mono + brutalist design system

## Key Constraints

- DO NOT add a framework (React, Vue, etc.)
- DO NOT add a bundler/build step
- DO NOT hardcode new hex color values — use CSS custom properties from `:root` in `global.css`
- DO NOT modify the `Cafes[]` array seed data unless explicitly asked
- The Google Maps API key in `index.html` is browser-restricted — don't move it without setting up a backend proxy

## Design System

Colors live in `src/styles/global.css` under `:root`:
- `--parchment: #F4EFEA` — background
- `--charcoal: #383838` — primary text + borders
- `--mother-yellow: #FAD80D` — accent yellow
- `--mother-blue: #6FC2FF` — accent blue
- `--mother-teal: #00E676` — success/verification green

Components: `.btn`, `.btn-primary`, `.btn-yellow`, `.card`, `.badge`, `.badge-speed`, `.badge-plug`, `.modal`, `.list-item`

## Tone

App copy is Indonesian-first with personality. Error messages should be cheeky (see `handleFormSubmit` for examples). Don't use formal bahasa.

## How to Test

```bash
python3 -m http.server 8080
# Open http://localhost:8080
```

See `AGENTS.md` for full project documentation.
