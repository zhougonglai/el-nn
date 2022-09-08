import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { app, BrowserWindow, shell, ipcMain, dialog, Tray, Menu } from 'electron'
import { release } from 'os'
import { join } from 'path'
import { darkMode, systemTheme, getTheme } from './ipcMain'

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

let win: BrowserWindow | null = null;
let tray = null;
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL as string
const indexHtml = join(ROOT_PATH.dist, 'index.html')

async function handleFileOpen(e, args) {
  console.log(args)
  return await dialog.showMessageBox(null, {
    ...args,
    icon: join(ROOT_PATH.public, 'node.png')
  })
}

async function createWindow() {
  // tray = new Tray(join(ROOT_PATH.public, 'node.png'))
  // tray.setContextMenu(Menu.buildFromTemplate([
  //   { label: 'Item1', type: 'radio' },
  // ]))

  win = new BrowserWindow({
    title: 'NN互娱',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    width: 1240,
    height: 800,
    frame: false,
    transparent: true,
    titleBarOverlay: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // nodeIntegration: true,
      // contextIsolation: false,
      nodeIntegration: false,
      contextIsolation: true,
    },
  })

  if (app.isPackaged) {
    win.loadFile(indexHtml)
  } else {
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  ipcMain.handle('dialog:openFile', handleFileOpen)

  ipcMain.handle('dark-mode:toggle', () => {
    darkMode();
    win.webContents.send('dark-mode:change', getTheme());
  })
  ipcMain.handle('dark-mode:system', () => {
    systemTheme();
    win.webContents.send('dark-mode:change', getTheme());
  })
  ipcMain.handle('dark-mode', getTheme)
}

app.whenReady().then(() => {
  return installExtension(VUEJS3_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log('An error occurred: ', err));
}).then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// new window example arg: new windows url
ipcMain.handle('open-win', (event, arg) => {
  console.log('open-win', url + arg)
  const childWindow = new BrowserWindow({
    title: 'NN互娱',
    icon: join(ROOT_PATH.public, 'favicon.ico'),
    width: 915,
    height: 542,
    transparent: true,
    titleBarOverlay: true,
    titleBarStyle: 'hidden',
    webPreferences: {
      preload,
      nodeIntegration: true,
    },
  })

  if (app.isPackaged) {
    childWindow.loadFile(indexHtml, { hash: arg })
  } else {
    childWindow.loadURL(`${url}${arg}`)
    // childWindow.webContents.openDevTools({ mode: "undocked", activate: true })
    childWindow.webContents.openDevTools()
  }
})
