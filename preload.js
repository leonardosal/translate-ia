const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  translateText: (text, targetLanguage, context) => ipcRenderer.invoke('translate-text', text, targetLanguage, context),
  getLanguages: () => ipcRenderer.invoke('get-languages')
});