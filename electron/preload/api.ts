import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI',{
  openFile: (arg) => ipcRenderer.invoke('dialog:openFile', arg),
  openWin: (arg) => ipcRenderer.invoke('open-win', arg)
})
