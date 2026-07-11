# High School Pre-Calculus Program (L1–L2)

An offline-first high-school math tutor — Foundations → Precalculus → a first
taste of Calculus. 12 units, 38 skills, auto-generated practice problems,
spaced-repetition review, and mastery-gated progression. Built by **Shree Shetty**.

## Repository layout

| Folder | What it is |
|---|---|
| [`highschool-precalculus-tutor/`](highschool-precalculus-tutor/) | The web app source — React 18 + TypeScript + Vite. Builds to a **single self-contained `index.html`** that runs offline in any browser. |
| [`windows-app/`](windows-app/) | Electron packaging that wraps the built app into an installable Windows program (installer `.exe` + portable `.zip`) with a **Google Sign-In** gate. |
| [`docs/`](docs/) | Full design spec, build spec, and files index. |

## Build the web app

```bash
cd highschool-precalculus-tutor
npm install
npm run build        # -> dist/index.html (single file, works on file://)
```

## Build the Windows installer

```bash
cd highschool-precalculus-tutor && npm install && npm run build
# copy dist/index.html into windows-app/app/index.html, then:
cd ../windows-app
npm install
npm run dist         # -> release/*.exe (installer) + release/*.zip (portable)
```

Requires Node.js 18+ on Windows 10/11. Binaries are intentionally **not**
committed (100 MB+); rebuild them with the two commands above.

## Google Sign-In setup

The desktop app requires a Google login before opening. Create a free Google
OAuth **Desktop app** Client ID and paste it into `config.json` — no rebuild
needed. Full walkthrough: [`windows-app/GOOGLE_OAUTH_SETUP.md`](windows-app/GOOGLE_OAUTH_SETUP.md).
Access can be restricted to specific Google accounts via the `allowedEmails`
list in the same file.

## Tech stack

React 18 · TypeScript 5 · Vite 5 (single-file build) · KaTeX · Electron 43 ·
electron-builder 26 · Google OAuth 2.0 (loopback + PKCE)
