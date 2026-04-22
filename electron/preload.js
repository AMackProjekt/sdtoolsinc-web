/**
 * electron/preload.js
 *
 * Exposes a minimal, safe surface to the renderer via contextBridge.
 * No Node.js APIs are directly exposed. Only whitelisted values/functions.
 */

import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronBridge', {
  // ── Runtime info ──────────────────────────────────────────────────────────
  platform: process.platform,
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
  isPackaged: !process.env.ELECTRON_IS_DEV,

  // ── NDA / session ─────────────────────────────────────────────────────────
  /** Mark NDA accepted in the main process (persisted across app sessions). */
  acceptNda: (signerName) => ipcRenderer.invoke('nda:accept', signerName),
  /** Check if NDA was previously accepted for this machine. */
  checkNda: () => ipcRenderer.invoke('nda:check'),
  /** Clear NDA acceptance (for reset/re-sign). */
  clearNda: () => ipcRenderer.invoke('nda:clear'),

  // ── Navigation ────────────────────────────────────────────────────────────
  /** Navigate back to the demo home screen. */
  goHome: () => ipcRenderer.send('nav:home'),
  /** Quit the application. */
  quit: () => ipcRenderer.send('app:quit'),
});
