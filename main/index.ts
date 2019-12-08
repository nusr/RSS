import { app, BrowserWindow, systemPreferences, ipcMain, Menu } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'
import { initMenu, IMPORT_KEY } from './menu'
import { initUpdaterMenuItems } from './updater'
let mainWindow: BrowserWindow | null = null
const isWindows = process.platform === 'win32'
initMenu()
initUpdaterMenuItems()

function createWindow() {
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webviewTag: true,
      webSecurity: false,
      // minimumFontSize: 12,
    },
    frame: !isWindows,
    height: 600,
    minHeight: 600,
    minWidth: 1200,
    width: 1200,
    icon: path.join(__dirname, './icons/png/256x256.png'),
    show: false,
    titleBarStyle: 'hiddenInset',
    // title: 'RSS',
  })
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000')
    mainWindow.webContents.openDevTools()
    mainWindow.maximize()
  } else {
    mainWindow.loadFile(path.join(__dirname, './index.html'))
  }
  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.once('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })
  ipcMain.on('GET_LOCALE', event => {
    const locale = app.getLocale()
    event.sender.send('RETURN_LOCALE', locale)
  })
  ipcMain.on('ENABLE_IMPORT_OPML', (event, enabled) => {
    const menu = Menu.getApplicationMenu()
    if (!menu) return
    const item = menu.getMenuItemById(IMPORT_KEY)
    item.enabled = enabled
    Menu.setApplicationMenu(menu)
  })
  // 监控深色模式切换
  systemPreferences.subscribeNotification(
    'AppleInterfaceThemeChangedNotification',
    function theThemeHasChanged() {
      console.info(systemPreferences.isDarkMode())
    }
  )
}
app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (!mainWindow) {
    createWindow()
  }
})

app.on(
  'web-contents-created',
  (event: Event, contents: Electron.WebContents) => {
    contents.on(
      'will-attach-webview',
      (event, webPreferences: Electron.WebPreferences) => {
        delete webPreferences.preload
        webPreferences.nodeIntegration = false
      }
    )
  }
)
