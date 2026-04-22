import { app, BrowserWindow, Menu } from 'electron';
import path from 'node:path';
/**
 * electron/main.js
 *
 * T.O.O.L.S Inc — Desktop Preview Application
 *
 * Security hardening:
 *  - Single-instance lock
 *  - Context isolation + sandbox + no nodeIntegration
 *  - Navigation restricted to localhost (dev) or file:// (packaged)
 *  - window.open blocked — external links open in system browser
 *  - CSP enforced via webRequest header injection
 *  - DevTools disabled in production
 */

import { app, BrowserWindow, Menu, shell, session, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const isDev = !app.isPackaged;

// ── Single-instance lock ───────────────────────────────────────────────────────
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) app.quit();

let mainWindow = null;

function applySecurityHeaders(ses) {
  ses.webRequest.onHeadersReceived((details, callback) => {
    const csp = isDev
      ? "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:3000 ws://localhost:3000; img-src 'self' data: blob:;"
      : "default-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; connect-src 'self'; font-src 'self' data:;";
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [csp],
        'X-Content-Type-Options': ['nosniff'],
        'X-Frame-Options': ['DENY'],
        'Referrer-Policy': ['strict-origin-when-cross-origin'],
      },
    });
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1600,
    height: 1000,
    minWidth: 1280,
    minHeight: 800,
    title: 'T.O.O.L.S Inc \u2014 Preview',
    icon: path.join(__dirname, '../build/icon.ico'),
    show: false,
    backgroundColor: '#06070b',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev,
    },
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) mainWindow.webContents.openDevTools({ mode: 'detach' });
  });

  const ALLOWED_ORIGIN = isDev ? 'http://localhost:3000' : 'file://';
  mainWindow.webContents.on('will-navigate', (event, url) => {
    if (!url.startsWith(ALLOWED_ORIGIN) && !url.startsWith('file://')) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  const startUrl = isDev
    ? 'http://localhost:3000/desktop-demo'
    : `file://${path.join(__dirname, '../out/desktop-demo/index.html')}`;

  mainWindow.loadURL(startUrl);
  mainWindow.on('closed', () => { mainWindow = null; });
}

app.whenReady().then(() => {
  applySecurityHeaders(session.defaultSession);
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// ── IPC handlers ───────────────────────────────────────────────────────────────
function getNdaFilePath() {
  const ndaDir = app.getPath('userData');
  return path.join(ndaDir, 'nda-acceptance.json');
}

function readNda() {
  try {
    const ndaFile = getNdaFilePath();
    if (!existsSync(ndaFile)) return null;
    return JSON.parse(readFileSync(ndaFile, 'utf8'));
  } catch { return null; }
}

function writeNda(data) {
  try {
    const ndaFile = getNdaFilePath();
    mkdirSync(path.dirname(ndaFile), { recursive: true });
    writeFileSync(ndaFile, JSON.stringify(data, null, 2), 'utf8');
  } catch { /* non-critical */ }
}

ipcMain.handle('nda:check', () => readNda());

ipcMain.handle('nda:accept', (_, signerName) => {
  const record = {
    accepted: true,
    signerName: typeof signerName === 'string' ? signerName.slice(0, 120) : 'Unknown',
    timestamp: new Date().toISOString(),
    appVersion: app.getVersion(),
  };
  writeNda(record);
  return record;
});

ipcMain.handle('nda:clear', () => {
  try {
    const ndaFile = getNdaFilePath();
    if (existsSync(ndaFile)) writeFileSync(ndaFile, '{}', 'utf8');
  } catch { /* ok */ }
  return true;
});

ipcMain.on('nav:home', () => mainWindow?.loadURL(homeUrl));
ipcMain.on('app:quit', () => app.quit());

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

const homeUrl = isDev
  ? 'http://localhost:3000/desktop-demo'
  : `file://${path.join(__dirname, '../out/desktop-demo/index.html')}`;

const menuTemplate = [
  {
    label: 'File',
    submenu: [
      { label: 'Home', accelerator: 'CmdOrCtrl+H', click: () => mainWindow?.loadURL(homeUrl) },
      { type: 'separator' },
      { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' }, { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' }, { role: 'copy' }, { role: 'paste' }, { role: 'selectAll' },
    ],
  },
  {
    label: 'View',
    submenu: [
      { role: 'resetZoom' }, { role: 'zoomIn' }, { role: 'zoomOut' },
      { type: 'separator' }, { role: 'togglefullscreen' },
      ...(isDev ? [{ type: 'separator' }, { role: 'reload' }, { role: 'forceReload' }, { role: 'toggleDevTools' }] : []),
    ],
  },
  {
    label: 'Help',
    submenu: [
      { label: 'Visit T.O.O.L.S Inc Website', click: () => shell.openExternal('https://sdtoolsinc.org') },
      { label: 'Request Full Access', click: () => shell.openExternal('https://sdtoolsinc.org/#contact') },
    ],
  },
];

Menu.setApplicationMenu(Menu.buildFromTemplate(menuTemplate));
