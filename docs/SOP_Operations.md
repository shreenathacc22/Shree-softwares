# 📘 SOP — Shree Shetty's Precalc Tutor: Operations Manual

**Document version:** 1.0 · **Date:** July 11, 2026 · **Owner:** Shree Shetty (shreenathacc22@gmail.com)
**App version covered:** 1.0.0

---

## 0. Purpose & Scope

**Document set** (all live in the distribution folder alongside this SOP):
- `START_HERE.md` — which document to read, by audience
- `USER_GUIDE_Precalc_Tutor.md` — student/parent guide (requirements, using the exe, app walkthrough, FAQ)
- `GOOGLE_OAUTH_SETUP.md` — deep-dive Google credential walkthrough (companion to SOP-2)
- `SOP_Config_Credentials_Setup.md` — filling config.json with a worked example + verification checklist (companion to SOP-3)
- `README_INSTALL.txt` — one-page quick install reference
- **This SOP** — administrator/owner operations

This SOP covers every routine operation for the Precalc Tutor desktop app:

| SOP # | Procedure | When you need it |
|---|---|---|
| SOP-1 | Install the app on a new Windows laptop | New machine for a student |
| SOP-2 | One-time Google OAuth credential setup | Before FIRST login ever works |
| SOP-3 | Configure `config.json` / manage who can sign in | Add/remove allowed users |
| SOP-4 | Edit the tutor (content/code) and rebuild packages | App changes |
| SOP-5 | Update the GitHub repository (**sanitization mandatory**) | Publishing changes |
| SOP-6 | Troubleshooting | Something broke |

---

## 1. Asset Inventory — where everything lives on THIS laptop

| Asset | Location |
|---|---|
| **Distribution folder** (share this) | `MCC_Highschool_Math_package\Windows-Installer\` |
| — Installer | `Shree Shetty's Precalc Tutor-1.0.0-x64.exe` (96 MB) |
| — Portable | `Shree Shetty's Precalc Tutor-1.0.0-x64.zip` (134 MB) |
| Web-app source code | `MCC_Highschool_Math_package\highschool-precalculus-tutor\` |
| Electron build workshop | `C:\Users\shree\TutorBuild\` (outside OneDrive on purpose) |
| Built artifacts backup | `C:\Users\shree\TutorBuild\release\` |
| Sanitized GitHub working copy | `C:\Users\shree\precalc-tutor-repo\` |
| GitHub repo / branch | `github.com/shreenathacc22/Shree-softwares` · branch `highschool_pre_cal_program_l1_l2` |
| Specs & docs | `MCC_Highschool_Math_package\*.md` |

> **Privacy rule (permanent):** the name **"Shree Shetty" must never appear in anything
> uploaded to GitHub or shared publicly** — GitHub copies use "Shree Shetty".
> Local files may keep the name. Enforced in SOP-5 step 4.

---

## SOP-1 — Install on a New Windows Laptop

**Prerequisites:** Windows 10/11 64-bit · ~350 MB disk · internet at login time only.
Nothing else (no Node, no Python) is needed on the target laptop.

### Method A — Installer (recommended for a laptop used regularly)

1. On THIS laptop, open `MCC_Highschool_Math_package\Windows-Installer\`.
2. **OneDrive check:** both big files must show ✅ (not ☁️). If ☁️: right-click →
   *Always keep on this device*, wait for download.
3. Copy the entire `Windows-Installer` folder to USB / email / cloud.
4. On the target laptop, double-click `Shree Shetty's Precalc Tutor-1.0.0-x64.exe`.
5. SmartScreen warning appears → click **More info → Run anyway**
   *(expected — app is self-built, not code-signed)*.
6. Pick install folder (default is fine) → **Install**.
7. Shortcuts are created on **Desktop** and **Start Menu**.
8. **Do not launch yet** → complete SOP-3 (config.json) first.

**Uninstall:** Windows Settings → Apps → "Shree Shetty's Precalc Tutor" → Uninstall.

### Method B — Portable (no install, any laptop, USB-friendly)

1. Copy `Shree Shetty's Precalc Tutor-1.0.0-x64.zip` to the target laptop.
2. Right-click → **Extract All** → choose any folder (e.g. `C:\Apps\Tutor`).
3. Run `Shree Shetty's Precalc Tutor.exe` inside the extracted folder.
4. Complete SOP-3 before first login.
5. To remove: delete the folder. Nothing else is left behind
   (except progress data in `%APPDATA%`, see SOP-6.7).

---

## SOP-2 — One-Time Google OAuth Setup (~5 minutes, done ONCE ever)

The app's login screen needs a Google OAuth **Desktop app** Client ID.
One Client ID works for **all laptops forever** — never repeat this SOP.

1. Go to **https://console.cloud.google.com** → sign in as shreenathacc22@gmail.com.
2. Project dropdown (top-left) → **New Project** → name `Precalc Tutor` → **Create**
   → then **select** the new project in the dropdown.
3. ☰ menu → **APIs & Services → OAuth consent screen** (a.k.a. *Google Auth Platform*):
   - App name `Precalc Tutor`, support + contact email = your email
   - Audience/User type: **External** → Save/Continue through remaining screens
4. **Add Test Users** ← most-missed step:
   - OAuth consent screen → **Audience → + Add users**
   - Add EVERY Gmail that may sign in (yours + your kid's) → **Save**
   - Keep the app in **Testing** mode permanently — only test users can log in,
     and no Google verification review is ever needed.
5. ☰ → **APIs & Services → Credentials → + Create Credentials → OAuth client ID**:
   - Application type: **Desktop app** (exactly this, NOT "Web application")
   - Name `Tutor Desktop` → **Create**
6. Copy from the popup:
   - **Client ID** — `NNNNN-xxxx.apps.googleusercontent.com`
   - **Client secret** — `GOCSPX-xxxx`
   *(Retrievable later: Credentials page → pencil ✏️ icon.)*
7. Proceed to SOP-3.

> A Desktop-app client secret is not truly confidential (per Google's own docs).
> Real security = the Google login itself + the `allowedEmails` list.

---

## SOP-3 — Configure config.json & Manage Allowed Users

`config.json` is read at app start. **Editing it never requires a rebuild.**

### 3.1 File locations (app reads in this priority order)

1. **`%APPDATA%\Shree Shetty's Precalc Tutor\config.json`** ← RECOMMENDED
   (`C:\Users\<user>\AppData\Roaming\Shree Shetty's Precalc Tutor\config.json`;
   survives reinstalls and updates)
2. Installed app: `<install folder>\resources\config.json`
3. Portable app: `<extracted folder>\resources\config.json`

### 3.2 Content

```json
{
  "google": {
    "clientId":  "NNNNN-xxxx.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-xxxx"
  },
  "allowedEmails": [
    "shreenathacc22@gmail.com",
    "student@gmail.com"
  ]
}
```

### 3.3 Rules

| Task | How |
|---|---|
| Allow a new user | Add their Gmail to `allowedEmails` **AND** add them as a Test User (SOP-2 step 4) |
| Block a user | Remove from `allowedEmails`, save file, restart app |
| Allow ANY Google account | Set `"allowedEmails": []` (empty list) |
| New laptop | Copy the same config.json — identical everywhere |

### 3.4 Verify

Start the app → the yellow "Setup needed" box must be **gone** → *Sign in with
Google* opens the browser → pick an allowed account → *"Google hasn't verified
this app"* → **Continue** (normal in Testing mode) → browser shows **✅ Signed
in** → tutor opens.

---

## SOP-4 — Edit the App & Rebuild the Packages

**Prerequisites (build laptop only):** Node.js 18+ (this laptop has v24 ✅).

1. **Edit** source in `MCC_Highschool_Math_package\highschool-precalculus-tutor\src\`
   (lesson content = `src\content\unit-XX.ts`, logic = `src\engine\`, UI = `src\components\`).
2. **Build the web app:**
   ```powershell
   cd "MCC_Highschool_Math_package\highschool-precalculus-tutor"
   npm install     # first time / after long gaps
   npm run build   # -> dist\index.html (single file)
   ```
3. **Copy the payload into the Electron workshop:**
   ```powershell
   copy dist\index.html C:\Users\shree\TutorBuild\app\index.html
   ```
4. **Package installer + zip:**
   ```powershell
   cd C:\Users\shree\TutorBuild
   npm run dist    # -> release\*.exe + release\*.zip (~2-4 min)
   ```
5. **Version bump (recommended):** edit `version` in
   `C:\Users\shree\TutorBuild\package.json` (e.g. `1.0.1`) before step 4 —
   artifact filenames update automatically.
6. **Smoke test:** run `release\win-unpacked\Shree Shetty's Precalc Tutor.exe` —
   login screen must appear.
7. **Publish locally:** copy the new `.exe` and `.zip` from
   `TutorBuild\release\` into `MCC_Highschool_Math_package\Windows-Installer\`
   (replace old versions).

---

## SOP-5 — Update the GitHub Repo (SANITIZATION MANDATORY)

Target: `github.com/shreenathacc22/Shree-softwares`, branch
`highschool_pre_cal_program_l1_l2`. Working copy: `C:\Users\shree\precalc-tutor-repo`.

1. Copy changed source files from the local project into the matching folders of
   `C:\Users\shree\precalc-tutor-repo\` (never copy `node_modules`, `dist`,
   binaries, or `.claude`).
2. **Sanitize names** — replace in all copied files:
   `Shree Shetty's → Shree Shetty's`, `Shree Shetty → Shree Shetty`,
   `Shree Shetty → shreeshetty` (also in any file NAMES).
3. **Never commit:** real `config.json` (template only), `.exe`, `.zip`
   (the 134 MB zip exceeds GitHub's 100 MB hard limit), `node_modules`.
   The `.gitignore` already blocks these — don't fight it.
4. **MANDATORY GATE — verify zero leaks before pushing:**
   ```powershell
   cd C:\Users\shree\precalc-tutor-repo
   git grep -i Shree Shetty        # MUST return nothing
   ```
   Any hit = STOP, fix, re-run.
5. Commit & push:
   ```powershell
   git add -A
   git commit -m "describe the change"
   git push
   ```
   (Auth uses the stored Windows Credential Manager token — no password prompt.)

---

## SOP-6 — Troubleshooting

| # | Symptom | Fix |
|---|---|---|
| 6.1 | Yellow "Setup needed" on login screen | `config.json` missing or still has `PASTE_...` placeholders → SOP-2 + SOP-3 |
| 6.2 | "Access denied for &lt;email&gt; … not in the allowed list" | Add email to `allowedEmails` (SOP-3.3), restart app |
| 6.3 | Google: "This app isn't verified" + can't proceed / "access_denied" | That Gmail isn't a **Test User** → SOP-2 step 4 |
| 6.4 | Browser opens, sign-in completes, app doesn't continue | Firewall blocked the local loopback port → allow the app in Windows Defender Firewall, retry. Also confirm internet is up |
| 6.5 | SmartScreen blocks install | **More info → Run anyway** (unsigned self-built app — expected) |
| 6.6 | `vite`/`electron-builder` "not recognized" during rebuild | Broken/partial `node_modules` (OneDrive sync is a common cause) → `npm install` again in that folder |
| 6.7 | Reset a student's progress | Delete `%APPDATA%\Shree Shetty's Precalc Tutor\` on THAT laptop (removes local progress + config — re-add config.json after). In-app: Progress → Reset also works |
| 6.8 | `git push` rejected: file over 100 MB | A binary got committed → remove it, keep binaries out (SOP-5.3) |
| 6.9 | Sign-in times out after 5 min | Complete the browser login faster, or click Sign in again |
| 6.10 | Progress lost after switching install method | Progress is stored per Windows user per machine in localStorage — use the in-app **Export/Import progress** feature to move it |

---

## 7. Version History

| Date | Version | Change |
|---|---|---|
| 2026-07-09 | 1.0.0 | Initial web app, 12 units / 38 skills, all 8 bugs fixed |
| 2026-07-10 | 1.0.0 | Windows packaging (Electron 43): installer + portable, Google Sign-In gate |
| 2026-07-11 | 1.0.0 | GitHub publish (sanitized) → Shree-softwares / highschool_pre_cal_program_l1_l2 |
| 2026-07-11 | 1.0.0 | Full doc set (START_HERE, User Guide, 2 SOPs) shipped + pushed; placeholder config.json created at `%APPDATA%\Shree Shetty's Precalc Tutor\` and launch-verified |

**Open items:**
- [ ] SOP-2 not yet executed — create Google Client ID (browser, ~5 min), then fill the
      already-created placeholder config.json per `SOP_Config_Credentials_Setup.md`.
      **Login is blocked until this is done.**
- [ ] Decide GitHub repo visibility (currently **public**; flip via repo Settings →
      Danger Zone → Change visibility, or ask Claude to do it via API)

---

*End of SOP. Keep this file with the distribution folder so it travels with the installer.*
