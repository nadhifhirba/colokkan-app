# CLAUDE.md — co.lok.kan

Project context for Claude Code and other AI agents.

## What This Is

co.lok.kan is a Vanilla JS PWA for finding work-friendly cafes in Jakarta. Community-verified WiFi speeds, outlet availability, and noise levels, with a time-aware forecast and a `Go Now` recommendation layer. No framework, no build step.

## Stack

- Plain HTML + CSS + JS (no bundler, no framework)
- Google Maps JavaScript API for rendering only
- Netlify Functions for public config, reports, and moderation
- Supabase-ready schema for cafes, reports, and review events
- Netlify (hosting + headers config)
- JetBrains Mono + brutalist design system

## Key Constraints

- DO NOT add a framework (React, Vue, etc.)
- DO NOT add a bundler/build step
- DO NOT hardcode new hex color values — use CSS custom properties from `:root` in `global.css`
- DO NOT modify the shared seed data in `shared/seed-cafes.js` unless explicitly asked
- The Google Maps browser key is served through `public-config` and env vars, not hardcoded in `index.html`

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
npx netlify dev --port 8888
# Open http://127.0.0.1:8888/index.html
```

See `AGENTS.md` for full project documentation.
