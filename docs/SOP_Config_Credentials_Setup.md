# 📙 SOP — Filling in config.json with Google Credentials (Worked Example)

**Document version:** 1.0 · **Date:** July 11, 2026 · **Owner:** Shree Shetty
**Applies to:** Shree Shetty's Precalc Tutor v1.2.0 · **Time needed:** ~2 minutes (after SOP-2 credentials exist)

---

## 1. Purpose

The app's Google login reads its credentials from a small text file called
**`config.json`**. A placeholder version of this file **already exists** on the
build laptop — this SOP shows exactly how to replace the placeholders with real
values, **with a worked example**, and how to verify it worked.

> **No rebuild, no reinstall, no coding.** This is a Notepad edit.

## 2. Prerequisites

| # | Requirement | How to check |
|---|---|---|
| 1 | Google OAuth credentials already created (Operations SOP-2 / `GOOGLE_OAUTH_SETUP.md` Part 1) | You have a **Client ID** ending in `.apps.googleusercontent.com` and a **Client secret** starting with `GOCSPX-` |
| 2 | App installed or extracted on the machine | Desktop shortcut exists, or you have the extracted portable folder |
| 3 | Know which Gmail addresses are allowed to use the app | e.g. yours + the student's |

## 3. Where the file lives

The app looks for `config.json` in this order — **edit the first one**:

| Priority | Location | Notes |
|---|---|---|
| 1 ⭐ | `%APPDATA%\Shree Shetty's Precalc Tutor\config.json` | **Recommended.** Survives reinstall/update. Already created with placeholders on the build laptop |
| 2 | `<install folder>\resources\config.json` | Bundled copy inside an installed app |
| 3 | `<extracted portable folder>\resources\config.json` | Bundled copy inside the portable version |

**To open location 1:** press `Win + R` → type `%APPDATA%\Shree Shetty's Precalc Tutor`
→ Enter → right-click `config.json` → **Open with → Notepad**.
*(If the folder doesn't exist on a new laptop: launch the app once, close it, look again — or create the folder yourself.)*

## 4. Worked Example — BEFORE ➜ AFTER

Say Google's credential popup (SOP-2, step 6) showed you:

> **Client ID:** `<12 digits>-<32 characters>.apps.googleusercontent.com`
> **Client secret:** `GOCSPX-<28 characters>`
> *(Shapes shown with placeholders — your real values are long random strings
> in exactly these shapes. Copy them from Google's popup, never retype them.)*

And you want to allow two people: `shreenathacc22@gmail.com` and the student
`student.math2026@gmail.com`.

### BEFORE (what the placeholder file looks like)

```json
{
  "_INSTRUCTIONS": "Replace the two PASTE_ values below ...",
  "google": {
    "clientId": "PASTE_YOUR_CLIENT_ID_HERE.apps.googleusercontent.com",
    "clientSecret": "PASTE_YOUR_CLIENT_SECRET_HERE"
  },
  "allowedEmails": [
    "shreenathacc22@gmail.com"
  ]
}
```

### AFTER (what you save)

```json
{
  "google": {
    "clientId": "<paste your full Client ID here>.apps.googleusercontent.com",
    "clientSecret": "<paste your full GOCSPX- secret here>"
  },
  "allowedEmails": [
    "shreenathacc22@gmail.com",
    "student.math2026@gmail.com"
  ]
}
```

*(In your saved file the `<...>` placeholders are fully replaced — including the
angle brackets — by the real pasted values. Note the Client ID you paste already
ends in `.apps.googleusercontent.com`, so the quotes end up containing it once.)*

### The 5 edit rules (where people go wrong)

1. Replace **only the text between the quotes** — keep the quotes themselves.
2. The Client ID keeps its `.apps.googleusercontent.com` ending — paste the
   **whole** thing from Google, don't append the ending twice.
3. Multiple emails are separated by a comma, **no comma after the last one**.
4. The `_INSTRUCTIONS` line is optional — delete it or keep it, both fine.
5. Save as plain text (Notepad's default). Don't let an editor turn quotes
   into “curly quotes”.

## 5. Step-by-Step Procedure

1. Open the file (Section 3).
2. Select `PASTE_YOUR_CLIENT_ID_HERE.apps.googleusercontent.com` → paste your
   real Client ID.
3. Select `PASTE_YOUR_CLIENT_SECRET_HERE` → paste your real Client secret.
4. Update `allowedEmails` — one line per Gmail, comma-separated (see AFTER above).
5. **Save** (`Ctrl+S`) and close Notepad.
6. **Restart the app** if it was open (config is read at startup).

## 6. Verification Checklist

Run through all five — total ~1 minute:

- [ ] **V1:** Launch the app → the yellow **"Setup needed"** box is **GONE**
  from the login screen. *(Still there? → the app is reading a different
  config.json than the one you edited, or a PASTE_ placeholder remains.)*
- [ ] **V2:** Click **Sign in with Google** → your browser opens Google's
  account picker. *(JSON syntax error would stop this — see Section 7.)*
- [ ] **V3:** Pick an allowed account → "Google hasn't verified this app"
  → **Continue** → browser shows **✅ Signed in**.
- [ ] **V4:** The tutor window opens automatically.
- [ ] **V5 (access control):** optionally try a Gmail NOT on the list — it must
  be rejected with *"This account is not permitted to use this app."*

**All five pass → this SOP is complete.** Login now works forever on this machine.

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Yellow "Setup needed" still shows | A `PASTE_` placeholder remains, or you edited a lower-priority copy while a placeholder sits in `%APPDATA%` | Edit the `%APPDATA%` copy (priority 1) — it always wins |
| Sign-in button does nothing / instant error | Broken JSON (missing quote/comma, curly quotes) | Paste file contents into `jsonlint.com`, fix, or re-copy the AFTER example and re-paste your two values |
| Google: `Error 401: invalid_client` | Client ID typo/incomplete | Re-copy from Google Cloud Console → Credentials → ✏️ |
| Google: `access_denied` | The Gmail isn't a **Test user** in Google Cloud | Console → OAuth consent screen → Audience → + Add users |
| "not permitted to use this app" | Gmail missing from `allowedEmails` | Add it (Section 4 AFTER), save, restart app |
| Works on laptop A, not laptop B | Laptop B has no/placeholder config | Copy laptop A's finished config.json to B (Section 8) |

## 8. Rolling out to more laptops

The finished `config.json` is **identical for every machine** — create it once,
copy it everywhere:

1. Copy the finished file to a USB stick / email it to yourself.
2. On each new laptop, after installing the app:
   place the file at `%APPDATA%\Shree Shetty's Precalc Tutor\config.json`
   (create the folder if needed) — **or** drop it into the app's
   `resources` folder.
3. Run the Verification Checklist (Section 6) once per laptop.

> 🔒 Keep a backup of the finished config.json with your distribution folder
> (e.g. `Windows-Installer\config.FILLED.json` renamed so you know it's real) —
> but **never** commit the filled version to GitHub. Only the placeholder
> template belongs in the repo.

---

## Related documents

- `GOOGLE_OAUTH_SETUP.md` — how to CREATE the credentials (do first)
- `SOP_Precalc_Tutor_Operations.md` — SOP-2/SOP-3 summarize this flow
- `USER_GUIDE_Precalc_Tutor.md` — what students see after login works

*End of SOP.*
