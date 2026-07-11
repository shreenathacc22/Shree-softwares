const { app, BrowserWindow, ipcMain, session } = require("electron");
const path = require("path");
const fs = require("fs");
const { googleSignIn } = require("./auth");

let loginWin = null;
let appWin = null;

// ---- Config loading ---------------------------------------------------------
// Priority: user data folder (editable after install) > bundled resources.
function loadConfig() {
  const candidates = [
    path.join(app.getPath("userData"), "config.json"),
    path.join(process.resourcesPath || "", "config.json"),
    path.join(__dirname, "..", "config.json"),
  ];
  for (const p of candidates) {
    try {
      if (fs.existsSync(p)) {
        return JSON.parse(fs.readFileSync(p, "utf8"));
      }
    } catch (e) {
      // ignore and try next
    }
  }
  return { google: {}, allowedEmails: [] };
}

function createLoginWindow() {
  loginWin = new BrowserWindow({
    width: 460,
    height: 620,
    resizable: false,
    center: true,
    title: "Sign in — Shree Shetty's Precalc Tutor",
    backgroundColor: "#0f172a",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  loginWin.setMenuBarVisibility(false);
  loginWin.loadFile(path.join(__dirname, "login.html"));
  loginWin.on("closed", () => {
    loginWin = null;
    // If the user closes the login window without signing in, quit the app.
    if (!appWin) app.quit();
  });
}

function createAppWindow(user) {
  appWin = new BrowserWindow({
    width: 1180,
    height: 820,
    minWidth: 720,
    minHeight: 560,
    center: true,
    title: "Shree Shetty's Precalc Tutor",
    backgroundColor: "#0f172a",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  appWin.setMenuBarVisibility(false);
  appWin.loadFile(path.join(__dirname, "..", "app", "index.html"));
  appWin.on("closed", () => {
    appWin = null;
  });
}

// ---- IPC: renderer asks main to run the Google flow -------------------------
ipcMain.handle("auth:signIn", async () => {
  const cfg = loadConfig();
  const user = await googleSignIn(cfg.google, cfg.allowedEmails);
  // success: swap login window for the app window
  if (loginWin) {
    const toClose = loginWin;
    loginWin = null; // prevent the 'closed' handler from quitting
    createAppWindow(user);
    toClose.close();
  }
  return user;
});

ipcMain.handle("auth:config", async () => {
  const cfg = loadConfig();
  const configured =
    !!cfg.google &&
    !!cfg.google.clientId &&
    !cfg.google.clientId.startsWith("PASTE_");
  return { configured };
});

// ---- App lifecycle ----------------------------------------------------------
app.whenReady().then(() => {
  // Harden: strip a permissive CSP is not needed; app is local. Block new windows.
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));
  createLoginWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createLoginWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
