import { app, BrowserWindow, Menu, shell, Tray } from "electron";
import installExtension, { VUEJS3_DEVTOOLS } from 'electron-devtools-installer';
import { join, resolve } from "path";
import { ROOT_PATH } from './index';

const preload = join(__dirname, '../preload/index.js');

const defaultConfig = () => ({
  title: 'NN互娱',
  icon: join(ROOT_PATH.public, 'icon.png'),
  width: 1280,
  height: 800,
  transparent: true,
  titleBarOverlay: true,
  titleBarStyle: 'hidden',
  webPreferences: {
    preload,
    nodeIntegration: true,
    contextIsolation: true,
  },
})


export default class App {
  wins = {
    main: null,
    sign: null,
  };
  tray;

  constructor() {
    this.tray = new Tray(join(ROOT_PATH.public,'icon.png'));
    this.tray.setContextMenu(Menu.buildFromTemplate([
      { label: 'Item1', type: 'radio' }
    ]));

    return this;
  }

  init() {
    app.on('window-all-closed', () => {
      this.wins = {
        main: null,
        sign: null,
      };
      if (process.platform !== 'darwin') app.quit()
    })

    app.on('second-instance', () => {
      if (this.wins.main) {
        // Focus on the main window if the user tried to open another
        if (this.wins.main.isMinimized()) this.wins.main.restore()
        this.wins.main.focus()
      }
    })

    app.on('activate', () => {
      const allWins = BrowserWindow.getAllWindows()
      if(allWins.length) {
        allWins[0].focus()
      } else {
        this.createWindow()
      }
    })
  }

  createWindow(url = process.env.VITE_DEV_SERVER_URL, target = 'main', config = defaultConfig() as Electron.BrowserWindowConstructorOptions) {
    const win = new BrowserWindow(config);
    if(app.isPackaged) {
      win.loadFile(join(ROOT_PATH.public, url));
    } else {
      win.loadURL(url);
      installExtension(VUEJS3_DEVTOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log('An error occurred: ', err));
      win.webContents.openDevTools();
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

    this.wins[target] = win;
  }
}
