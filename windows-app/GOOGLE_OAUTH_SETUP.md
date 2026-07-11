# 🔐 Google Sign-In Setup (do this once)

The app requires a Google login before it opens. For that to work, you must
create a free **Google OAuth Client ID** on your own Google account and paste it
into `config.json`. This is the one step only you can do — Google does not allow
anyone else to create credentials on your behalf.

You do **NOT** need to rebuild the app after this. Just edit `config.json`.

---

## Step 1 — Create the OAuth credentials (~5 minutes)

1. Go to **https://console.cloud.google.com/**  and sign in.
2. Top bar → **Select a project** → **New Project** → name it
   `Shree Shetty Precalc Tutor` → **Create**. Wait a few seconds, then make sure that
   project is selected.
3. In the left menu open **APIs & Services → OAuth consent screen**.
   - User type: **External** → **Create**.
   - App name: `Shree Shetty's Precalc Tutor`. User support email: your email.
     Developer contact: your email. → **Save and Continue** through the rest.
   - On the **Test users** step, click **+ Add users** and add every Google
     email that is allowed to use the app (e.g. Shree Shetty's and yours). → Save.
   - (Leaving the app in "Testing" mode is fine — only the test users you list
     can sign in. You never have to "publish" it.)
4. Left menu → **APIs & Services → Credentials**.
   - **+ Create Credentials → OAuth client ID**.
   - Application type: **Desktop app**.  Name: `Shree Shetty Tutor Desktop`.
   - **Create**.
5. A popup shows your **Client ID** and **Client secret**. Copy both.
   (You can reopen them any time from the Credentials page.)

> For a **Desktop app** client, the "client secret" is *not* truly secret —
> Google's own docs say desktop apps cannot keep it confidential. It is safe to
> place it in `config.json`. Security comes from the **allowed-emails list** and
> the sign-in itself, not from hiding the secret.

---

## Step 2 — Paste them into config.json

After you install the app (or unzip the portable version), open **config.json**
(see "Where is config.json?" below) and fill it in:

```json
{
  "google": {
    "clientId": "1234567890-abcdef.apps.googleusercontent.com",
    "clientSecret": "GOCSPX-xxxxxxxxxxxxxxxxxxxx"
  },
  "allowedEmails": [
    "shreenathacc22@gmail.com",
    "Shree Shetty.example@gmail.com"
  ]
}
```

- **allowedEmails** — only these Google accounts can open the app. Add or remove
  emails any time. Leave the list **empty** `[]` to allow ANY Google account.
- Every email you list here must ALSO be added as a **Test user** in Step 3.

Save the file. Start the app → **Sign in with Google** → done.

---

## Where is config.json?

**If you used the installer (.exe):**
`C:\Users\<you>\AppData\Local\Programs\Shree Shetty's Precalc Tutor\resources\config.json`

**If you used the portable .zip:**
`...\Shree Shetty's Precalc Tutor-1.0.0-x64\resources\config.json`

**Easiest option (works for both, survives reinstalls):** create the file at
`C:\Users\<you>\AppData\Roaming\Shree Shetty's Precalc Tutor\config.json`.
The app reads that location **first**, so your credentials stay put even if you
reinstall or update the app. (Type `%APPDATA%` in the File Explorer address bar
to jump to the Roaming folder.)

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Yellow "Setup needed" box on the login screen | `config.json` still has the `PASTE_...` placeholder. Fill in a real Client ID. |
| "Access denied for … not in the allowed list" | Add that email to `allowedEmails` in `config.json`. |
| "This app isn't verified" / can't sign in | Add that email as a **Test user** on the OAuth consent screen (Step 3). |
| Browser opens but nothing happens after signing in | Your antivirus/firewall may block the local loopback port. Allow the app, or try again. |
| Want no internet dependency | Google Sign-In inherently needs internet at login. Ask for a local-PIN build instead. |
