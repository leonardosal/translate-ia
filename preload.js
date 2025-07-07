const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  translateText: (text, targetLanguage, context) => ipcRenderer.invoke('translate-text', text, targetLanguage, context),
  getLanguages: () => ipcRenderer.invoke('get-languages'),
  getConfig: () => ipcRenderer.invoke('get-config'),
  saveConfig: (config) => ipcRenderer.invoke('save-config', config),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('toggle-always-on-top')
});