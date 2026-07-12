# macOS App — Precalc Tutor

**This folder is the macOS-specific build** of the High School Pre-Calculus
Program, parallel to [`windows-app/`](../windows-app/) (the Windows/Electron
build). No Electron here — macOS packaging is deliberately lightweight: the
web app already builds to a single self-contained `index.html`, so the "app"
is just that file plus a native launcher, shipped as a drag-install `.dmg`.

## How the macOS build works

```
Precalc Tutor.app/
├── Contents/
│   ├── Info.plist              ← bundle metadata (see dmg-app/Info.plist)
│   ├── MacOS/
│   │   └── Launcher            ← bash script (see dmg-app/Launcher.sh)
│   └── Resources/
│       └── Precalc Tutor.html  ← the built single-file web app
```

The launcher opens the embedded HTML in Google Chrome (falls back to the
default browser). Progress is stored in the browser's `localStorage`, so it
persists per macOS user account with no server and no login.

## Folder contents

| File | Purpose |
|---|---|
| `build-dmg.sh` | One-command build: web app → `.app` bundle → compressed `.dmg` |
| `dmg-app/Launcher.sh` | The `.app`'s executable — opens the embedded HTML in a browser |
| `dmg-app/Info.plist` | App bundle metadata (name, identifier, version) |
| `launcher/main.applescript` | Optional shared-Mac launcher (see below) |

## Build the DMG

```bash
cd macos-app
./build-dmg.sh          # -> release/Precalc-Tutor-<version>.dmg
```

The script builds the web app (`npm install && npm run build` in
`../highschool-precalculus-tutor`), assembles the `.app` bundle, and packages
it with an `/Applications` symlink using `hdiutil`. Built artifacts land in
`macos-app/release/` (gitignored, like the Windows `release/` folder).

Users install by opening the DMG and dragging the app to Applications —
standard macOS drag-install, no admin rights needed.

## Alternative: multi-user shared-Mac deployment

For a family/classroom Mac with several accounts, skip the DMG and share one
copy of the app instead:

1. Copy the built `dist/index.html` to `/Users/Shared/Precalc Tutor.html`
   (readable by every account).
2. Compile `launcher/main.applescript` into an app with Script Editor or:
   `osacompile -o "/Applications/Precalc Tutor.app" launcher/main.applescript`
3. Give each user a Dock/Desktop shortcut to that launcher.

Every account opens the same HTML but gets independent progress
(per-account browser `localStorage`). Updating the app for everyone is one
file copy — the launchers never change.

## Requirements

- macOS 10.13+ (build machine needs Node 18+ and Xcode command-line tools
  for `hdiutil`/`osacompile` — both ship with macOS)
- No code signing required for personal/family distribution; users may need
  to right-click → Open on first launch (Gatekeeper).
