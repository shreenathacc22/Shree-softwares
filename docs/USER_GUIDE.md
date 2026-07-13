# 📗 User Guide — Shree Shetty's Precalc Tutor (v1.2.0)

**Audience:** students and parents using the app.
*(Administrators/builders: see `SOP_Precalc_Tutor_Operations.md` instead.)*

---

## 1. What this app is

A complete high-school math course on your computer:
**Foundations → Precalculus → your first real Calculus.**

- **13 units, 50 skills** — each unit unlocks when you master the one before it
- **Unlimited practice** — problems are auto-generated, never the same twice
- **Mixed Review** — old skills resurface on a smart schedule so you don't forget
- **Works offline** — internet is needed only at the moment you sign in
- **Private** — your progress is stored only on your own computer

---

## 2. Detailed Requirements

| Requirement | Detail |
|---|---|
| Operating system | Windows 10 or Windows 11, **64-bit** |
| Disk space | ~350 MB free |
| Memory | 4 GB RAM or more recommended |
| Internet | **Only at sign-in.** After login, everything works offline |
| Google account | A Gmail address that the administrator has put on the allowed list |
| Browser | Any default browser (used once per sign-in — Chrome/Edge/Firefox all fine) |
| Extra software | **None.** No Node, no Python, nothing to install first |

> ⚠️ Before anyone can sign in, the administrator must have completed the
> one-time Google setup (`GOOGLE_OAUTH_SETUP.md`) and placed `config.json`
> next to the app. If the login screen shows a yellow **"Setup needed"** box,
> that step hasn't been done yet — contact the administrator.

---

## 3. Getting the App Running — Step by Step

### Option A — Install it (recommended for your own laptop)

1. Get `Shree Shetty's Precalc Tutor-1.2.0-x64.exe` from the administrator
   (USB stick, email, or cloud link).
2. **Double-click** the `.exe`.
3. A blue **Windows SmartScreen** warning may appear
   ("Windows protected your PC"). This is normal for a family-built app:
   click **More info**, then **Run anyway**.
4. The installer opens. Keep the suggested folder (or pick your own) → **Install**.
5. When it finishes, you'll have:
   - a **Desktop shortcut**: *Shree Shetty's Precalc Tutor*
   - a **Start Menu** entry with the same name
6. Double-click the shortcut to launch. → Continue to Section 4 (Signing in).

**To uninstall later:** Windows Settings → Apps → Installed apps →
*Shree Shetty's Precalc Tutor* → Uninstall.

### Option B — Portable (run from a folder or USB, nothing installed)

1. Get `Shree Shetty's Precalc Tutor-1.2.0-x64.zip`.
2. Right-click the zip → **Extract All…** → choose any folder → **Extract**.
3. Open the extracted folder and double-click **`Shree Shetty's Precalc Tutor.exe`**.
   (Same SmartScreen note as above: More info → Run anyway.)
4. To remove the app later, just delete the folder.

---

## 4. Signing In (first launch and every launch)

1. The app opens to a dark **sign-in window** with one button.
2. Click **Sign in with Google**.
3. Your web browser opens Google's account chooser. Pick your account.
4. Google may say ***"Google hasn't verified this app"*** — this is expected
   (the app is private, not published in any store). Click **Continue**.
5. The browser page will say **✅ Signed in** — you can close that tab.
6. The tutor window opens automatically. 🎉

**Possible sign-in messages and what they mean:**

| Message | Meaning / what to do |
|---|---|
| Yellow "Setup needed" box | Administrator hasn't configured Google yet (Section 2 note) |
| "This account is not permitted to use this app" | Your Gmail isn't on the allowed list — ask the administrator to add you |
| "Sign-in timed out" | You took longer than 5 minutes in the browser — click the button and try again |
| Nothing happens after browser sign-in | Check internet; if a firewall popup appeared, click **Allow**, then retry |

---

## 5. Using the App — Daily Flow

### 5.1 Home screen
- Enter your name the first time (**Set your name**) — the app greets you with it.
- You'll see all **13 units** listed. Unit 0 is open; the rest show 🔒 until you
  master everything in the unit before them.
- Each unlocked unit shows a **progress bar** and a mastered count like `2/4`.

### 5.2 Learning a skill
1. Click an unlocked unit → you see its **skill list** (✓ = mastered, • = not yet).
2. Click a skill → read the short **lesson** (worked examples with real math
   notation).
3. Click **Start practice**.

### 5.3 Practicing
- Each problem is either **multiple choice** or **type your answer**.
- The **dots at the top** show your *streak toward mastery* — you need several
  correct answers in a row (usually 3–5, varies by skill).
- Stuck? Use **hints** — they reveal one step at a time.
- Wrong answer? You'll often get a note explaining the likely mistake
  (misconception feedback), and your streak resets — that's how mastery works.
- When the dots fill up: **🎉 skill mastered**. It gets a ✓ and will come back
  later in Mixed Review to keep it fresh.

### 5.4 Mastery Check & unlocking the next unit
- Inside a unit, click **Take Mastery Check**.
- It passes only when **every** skill in the unit is mastered; otherwise it
  lists exactly which skills still need work (with your streak progress).
- Passing a unit **unlocks the next one** — you'll see a toast:
  *"🎉 Unlocked: …"*.

### 5.5 Mixed Review (the secret to remembering)
- When previously-mastered skills are **due**, the Home screen shows a
  **"🔁 Mixed Review ready"** card with a count.
- Click **Start review** and work through the queue (one problem per due skill).
- Do reviews whenever they appear — spaced review is what makes math stick.

### 5.6 Progress screen (top-right button)
- Shows **skills mastered** and **units unlocked**.
- **⬇ Export progress** — saves a small `.json` backup file. Do this weekly, or
  before switching computers.
- **⬆ Import progress** — load a previously exported file (e.g. on a new laptop).
- **Reset** — wipes everything (asks for confirmation; cannot be undone).

---

## 6. Where your data lives & moving computers

- Progress **saves automatically** on this computer, per Windows user.
  No cloud, no server — it never leaves your machine.
- Signing in with Google does **not** sync progress between computers.
  To move: **Export** on the old computer → copy the `.json` file →
  **Import** on the new one.

---

## 7. FAQ

**Do I need internet to practice?**
No — only to sign in when the app starts. Practice, lessons, and reviews are
fully offline.

**Can two people use the same laptop?**
Yes — each Windows user account gets separate progress. (Same Windows account =
shared progress, so prefer separate Windows logins.)

**I mastered a skill but it appeared again — is that a bug?**
No, that's Mixed Review doing its job. Skills resurface on a schedule so you
retain them.

**The math symbols look like gibberish/plain text?**
Restart the app. If it persists, contact the administrator for a rebuilt copy.

**Who do I contact for help?**
The administrator: **shreenathacc22@gmail.com**.

---

*Guide version 1.0 · July 11, 2026 · matches app v1.2.0*
