const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script loaded!');

contextBridge.exposeInMainWorld('electronAPI', {
  // Folders
  folders: {
    getAll: () => ipcRenderer.invoke('folders:getAll'),
    create: (folder) => ipcRenderer.invoke('folders:create', folder),
    update: (id, folder) => ipcRenderer.invoke('folders:update', id, folder),
    delete: (id) => ipcRenderer.invoke('folders:delete', id)
  },
  
  // Prompts
  prompts: {
    getAll: () => ipcRenderer.invoke('prompts:getAll'),
    getByFolder: (folderId) => ipcRenderer.invoke('prompts:getByFolder', folderId),
    create: (prompt) => ipcRenderer.invoke('prompts:create', prompt),
    update: (id, prompt) => ipcRenderer.invoke('prompts:update', id, prompt),
    delete: (id) => ipcRenderer.invoke('prompts:delete', id),
    search: (query) => ipcRenderer.invoke('prompts:search', query)
  },
  
  // Clipboard
  clipboard: {
    getAll: (limit) => ipcRenderer.invoke('clipboard:getAll', limit),
    search: (query) => ipcRenderer.invoke('clipboard:search', query),
    delete: (id) => ipcRenderer.invoke('clipboard:delete', id),
    clear: () => ipcRenderer.invoke('clipboard:clear'),
    copyToClipboard: (text) => ipcRenderer.invoke('clipboard:copyToClipboard', text)
  },
  
  // Settings
  settings: {
    get: (key) => ipcRenderer.invoke('settings:get', key),
    set: (key, value) => ipcRenderer.invoke('settings:set', key, value),
  },
  canvases: {
    getAll: () => ipcRenderer.invoke('canvases:getAll'),
    create: (canvas) => ipcRenderer.invoke('canvases:create', canvas),
    update: (id, canvas) => ipcRenderer.invoke('canvases:update', id, canvas),
    delete: (id) => ipcRenderer.invoke('canvases:delete', id),
  }
});

console.log('electronAPI exposed to window!');
