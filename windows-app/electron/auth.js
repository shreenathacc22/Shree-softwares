// Google Sign-In for a desktop app, the Google-compliant way:
// system browser + loopback redirect + PKCE (RFC 8252). Google BLOCKS OAuth
// inside embedded windows, so we must use the real browser and catch the
// redirect on a localhost server.

const http = require("http");
const crypto = require("crypto");
const https = require("https");
const { shell } = require("electron");

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

function base64url(buf) {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function decodeIdToken(idToken) {
  const payload = idToken.split(".")[1];
  const json = Buffer.from(
    payload.replace(/-/g, "+").replace(/_/g, "/"),
    "base64"
  ).toString("utf8");
  return JSON.parse(json);
}

// POST application/x-www-form-urlencoded to Google's token endpoint.
function postToken(params) {
  const body = new URLSearchParams(params).toString();
  return new Promise((resolve, reject) => {
    const req = https.request(
      TOKEN_ENDPOINT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            const parsed = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) resolve(parsed);
            else reject(new Error(parsed.error_description || parsed.error || data));
          } catch (e) {
            reject(new Error("Bad token response: " + data));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

/**
 * Run the full interactive Google Sign-In.
 * @param {{clientId:string, clientSecret:string}} google
 * @param {string[]} allowedEmails  empty = any Google account is allowed
 * @returns {Promise<{email:string, name:string, picture:string}>}
 */
function googleSignIn(google, allowedEmails) {
  return new Promise((resolve, reject) => {
    if (!google || !google.clientId || google.clientId.startsWith("PASTE_")) {
      return reject(
        new Error(
          "Google Sign-In is not configured yet. Add your Client ID to config.json (see GOOGLE_OAUTH_SETUP.md)."
        )
      );
    }

    const verifier = base64url(crypto.randomBytes(32));
    const challenge = base64url(
      crypto.createHash("sha256").update(verifier).digest()
    );
    const state = base64url(crypto.randomBytes(16));

    let settled = false;
    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      try { server.close(); } catch (_) {}
      reject(new Error("Sign-in timed out. Please try again."));
    }, 5 * 60 * 1000);

    const server = http.createServer(async (req, res) => {
      const url = new URL(req.url, "http://127.0.0.1");
      if (url.pathname !== "/") {
        res.writeHead(404);
        res.end();
        return;
      }
      const code = url.searchParams.get("code");
      const returnedState = url.searchParams.get("state");
      const err = url.searchParams.get("error");

      const finish = (ok, message) => {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(
          `<html><body style="font-family:system-ui;text-align:center;padding-top:80px;background:#0f172a;color:#e2e8f0">
             <h2>${ok ? "✅ Signed in" : "⚠️ Sign-in failed"}</h2>
             <p>${message}</p>
             <p style="opacity:.6">You can close this tab and return to Shree Shetty's Precalc Tutor.</p>
           </body></html>`
        );
      };

      if (err) {
        finish(false, "Google returned: " + err);
        cleanup(new Error("Google sign-in was cancelled or denied."));
        return;
      }
      if (!code || returnedState !== state) {
        finish(false, "Invalid response.");
        cleanup(new Error("Invalid sign-in response (state mismatch)."));
        return;
      }

      try {
        const redirectUri = `http://127.0.0.1:${server.address().port}`;
        const token = await postToken({
          code,
          client_id: google.clientId,
          client_secret: google.clientSecret || "",
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          code_verifier: verifier,
        });
        const claims = decodeIdToken(token.id_token);
        const email = (claims.email || "").toLowerCase();

        if (!claims.email_verified) {
          finish(false, "Your Google email is not verified.");
          cleanup(new Error("Email not verified by Google."));
          return;
        }
        const allow = (allowedEmails || []).map((e) => e.toLowerCase());
        if (allow.length > 0 && !allow.includes(email)) {
          finish(false, "This account is not permitted to use this app.");
          cleanup(new Error(`Access denied for ${email}. Not in the allowed list.`));
          return;
        }

        finish(true, `Welcome, ${claims.name || email}!`);
        cleanup(null, {
          email,
          name: claims.name || email,
          picture: claims.picture || "",
        });
      } catch (e) {
        finish(false, e.message);
        cleanup(e);
      }
    });

    function cleanup(error, user) {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      setTimeout(() => { try { server.close(); } catch (_) {} }, 500);
      if (error) reject(error);
      else resolve(user);
    }

    server.on("error", (e) => cleanup(e));

    // Bind to an ephemeral loopback port (Google allows any 127.0.0.1 port for Desktop clients).
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      const redirectUri = `http://127.0.0.1:${port}`;
      const authUrl =
        AUTH_ENDPOINT +
        "?" +
        new URLSearchParams({
          client_id: google.clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          code_challenge: challenge,
          code_challenge_method: "S256",
          state,
          access_type: "offline",
          prompt: "select_account",
        }).toString();
      shell.openExternal(authUrl);
    });
  });
}

module.exports = { googleSignIn };
