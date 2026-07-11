const { contextBridge, ipcRenderer } = require("electron");

// Minimal, safe bridge: the login page can only trigger sign-in and read
// whether Google is configured. No Node access is exposed to page content.
contextBridge.exposeInMainWorld("authAPI", {
  signIn: () => ipcRenderer.invoke("auth:signIn"),
  config: () => ipcRenderer.invoke("auth:config"),
});
