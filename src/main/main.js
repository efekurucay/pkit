const { app, BrowserWindow, ipcMain, clipboard, Tray, Menu, nativeImage } = require('electron');
const path = require('path');
const Database = require('./database');
const ClipboardMonitor = require('./clipboard');

let mainWindow;
let db;
let clipboardMonitor;
let tray;

function createTray() {
  tray = new Tray(nativeImage.createEmpty());
  const contextMenu = Menu.buildFromTemplate([
    { label: 'PromptKit Aç', click: () => { if (mainWindow) mainWindow.show(); else createWindow(); } },
    { label: 'Clipboard Geçmişi', click: () => { createWindow(); } },
    { type: 'separator' },
    { label: 'Çıkış', click: () => { app.quit(); } }
  ]);
  tray.setToolTip('PromptKit - Prompt Manager');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => { if (mainWindow) mainWindow.show(); else createWindow(); });
}

function createWindow() {
  if (mainWindow) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 600,
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  const isDev = process.env.ELECTRON_START_URL;
  
  console.log('=== Electron Debug Info ===');
  console.log('isDev:', !!isDev);
  console.log('__dirname:', __dirname);
  console.log('=========================');
  
  if (isDev) {
    mainWindow.loadURL(process.env.ELECTRON_START_URL);
  } else {
    // Production: __dirname asar içini gösterir, index.html orada
    mainWindow.loadFile(path.join(__dirname, 'index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // DevTools sadece development modunda aç
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(async () => {
  db = new Database(app.getPath('userData'));
  
  await new Promise(resolve => {
    const checkDb = setInterval(() => {
      if (db.db) {
        clearInterval(checkDb);
        resolve();
      }
    }, 100);
  });
  
  clipboardMonitor = new ClipboardMonitor(db);
  clipboardMonitor.start();

  createTray();
  createWindow();

  app.on('activate', () => {
    createWindow();
  });
});

app.on('window-all-closed', (e) => {
  e.preventDefault();
});

app.on('before-quit', () => {
  app.isQuitting = true;
  if (clipboardMonitor) {
    clipboardMonitor.stop();
  }
  if (db) {
    db.close();
  }
});

// IPC Handlers

// Folders
ipcMain.handle('folders:getAll', async () => {
  return db.getAllFolders();
});

ipcMain.handle('folders:create', async (event, folder) => {
  return db.createFolder(folder);
});

ipcMain.handle('folders:update', async (event, id, folder) => {
  return db.updateFolder(id, folder);
});

ipcMain.handle('folders:delete', async (event, id) => {
  return db.deleteFolder(id);
});

// Prompts
ipcMain.handle('prompts:getAll', async () => {
  return db.getAllPrompts();
});

ipcMain.handle('prompts:getByFolder', async (event, folderId) => {
  return db.getPromptsByFolder(folderId);
});

ipcMain.handle('prompts:create', async (event, prompt) => {
  return db.createPrompt(prompt);
});

ipcMain.handle('prompts:update', async (event, id, prompt) => {
  return db.updatePrompt(id, prompt);
});

ipcMain.handle('prompts:delete', async (event, id) => {
  return db.deletePrompt(id);
});

ipcMain.handle('prompts:search', async (event, query) => {
  return db.searchPrompts(query);
});

// Clipboard
ipcMain.handle('clipboard:getAll', async (event, limit = 100) => {
  return db.getClipboardHistory(limit);
});

ipcMain.handle('clipboard:search', async (event, query) => {
  return db.searchClipboard(query);
});

ipcMain.handle('clipboard:delete', async (event, id) => {
  return db.deleteClipboardItem(id);
});

ipcMain.handle('clipboard:clear', async () => {
  return db.clearClipboardHistory();
});

ipcMain.handle('clipboard:copyToClipboard', async (event, text) => {
  clipboard.writeText(text);
  return true;
});

// Settings
ipcMain.handle('settings:get', async (event, key) => {
  return db.getSetting(key);
});

ipcMain.handle('settings:set', async (event, key, value) => {
  return db.setSetting(key, value);
});
