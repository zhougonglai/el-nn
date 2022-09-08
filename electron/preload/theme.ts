const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('darkMode', {
  getTheme: theme => ipcRenderer.invoke('dark-mode', theme),
  toggle: () => ipcRenderer.invoke('dark-mode:toggle'),
  system: () => ipcRenderer.invoke('dark-mode:system'),
  onThemeChange: theme => ipcRenderer.on('dark-mode:change', theme),
})
