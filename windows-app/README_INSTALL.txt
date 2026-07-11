======================================================================
  Shree Shetty's Precalc Tutor — Windows App (v1.0.0)
  Installable desktop package with Google Sign-In
======================================================================

WHAT'S IN THIS FOLDER
---------------------
  Shree Shetty's Precalc Tutor-1.0.0-x64.exe   <- INSTALLER (recommended)
  Shree Shetty's Precalc Tutor-1.0.0-x64.zip   <- PORTABLE (no install)
  config.template.json                    <- Google credentials template
  GOOGLE_OAUTH_SETUP.md                   <- REQUIRED one-time Google setup
  README_INSTALL.txt                      <- this file


BEFORE FIRST USE (REQUIRED)
---------------------------
The app asks you to sign in with Google before it opens. You must create a
free Google OAuth Client ID once and paste it into config.json.
  --> Open GOOGLE_OAUTH_SETUP.md and follow Steps 1-2. Takes ~5 minutes.
Without this, the login screen shows a yellow "Setup needed" message.


OPTION A — INSTALL (recommended for a laptop you keep using)
------------------------------------------------------------
  1. Double-click "Shree Shetty's Precalc Tutor-1.0.0-x64.exe".
  2. Windows SmartScreen may warn (the app is not code-signed):
     click "More info" -> "Run anyway". This is expected for a
     personal, self-built app.
  3. Choose an install folder if asked, then Install.
  4. A Start Menu + Desktop shortcut are created.
  5. Fill in config.json with your Google Client ID (see the setup guide).
  6. Launch, click "Sign in with Google".


OPTION B — PORTABLE (carry it to ANY Windows laptop, no install)
---------------------------------------------------------------
  1. Copy the .zip to the other laptop (USB, email, cloud).
  2. Right-click -> Extract All.
  3. Open the extracted folder, run "Shree Shetty's Precalc Tutor.exe".
  4. Fill in config.json (inside the "resources" subfolder) with your
     Google Client ID.
  --> Nothing gets installed; delete the folder to remove it completely.


SYSTEM REQUIREMENTS
-------------------
  - Windows 10 or 11, 64-bit
  - ~350 MB free disk space
  - Internet connection AT LOGIN ONLY (Google Sign-In needs it);
    the lessons themselves run fully offline afterward.


PROGRESS & PRIVACY
------------------
  - Each student's progress is saved privately on that device.
  - No servers, no accounts stored anywhere except Google's sign-in.
  - You can change who is allowed in anytime via config.json (allowedEmails).


SUPPORT
-------
  shreenathacc22@gmail.com
======================================================================
