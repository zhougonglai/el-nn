import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron'
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer'
import { release } from 'os'
import { join } from 'path'
import App from './boot'
import { darkMode, getTheme, systemTheme } from './ipcMain'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

export const ROOT_PATH = {
  // /dist
  dist: join(__dirname, '../..'),
  // /dist or /public
  public: join(__dirname, app.isPackaged ? '../..' : '../../../public'),
}

app.whenReady().then(() =>{
  const main = new App();
  main.createWindow();
  main.init()
  ipcMain.handle('dark-mode:toggle', () => {
    darkMode();
    main.wins.main.webContents.send('dark-mode:change', getTheme());
  })
  ipcMain.handle('dark-mode:system', () => {
    systemTheme();
    main.wins.main.webContents.send('dark-mode:change', getTheme());
  })
  ipcMain.handle('dark-mode', getTheme)
})
