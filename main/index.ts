import { app, BrowserWindow } from 'electron'
import isDev from 'electron-is-dev'
import path from 'path'
import { initMenu } from './menu'
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
      webSecurity: true,
    },
    frame: !isWindows,
    height: 600,
    minHeight: 600,
    minWidth: 1200,
    width: 1200,
    icon: path.join(__dirname, './icons/png/256x256.png'),
    show: false,
    titleBarStyle: 'hiddenInset',
    // vibrancy: 'dark',
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
