# Contributing to co.lok.kan

Thanks for wanting to help! Full guidelines are in [AGENTS.md](./AGENTS.md).

## Quick rules

1. **No frameworks** — Vanilla JS only, no React/Vue/bundlers
2. **Use CSS tokens** — colors and spacing from `:root` in `global.css` only
3. **Indonesian-first copy** — user-facing strings in Bahasa Indonesia, with personality
4. **Keyboard accessible** — all interactive elements need `:focus-visible` states
5. **No new external scripts** without updating the CSP in `netlify.toml`

## How to add a new cafe

See the "How to Add a New Coworking Space" section in [AGENTS.md](./AGENTS.md).

## Submitting changes

1. Fork the repo
2. Create a branch: `git checkout -b feat/your-feature`
3. Test locally with `python3 -m http.server 8080`
4. Open a PR against `main`
