// Modules to control application life and create native browser window
import { app, BrowserWindow } from "electron";
import isDev from "electron-is-dev";
import path from "path";
import { initMenu } from "./menu";
import { initUpdaterMenuItems } from "./updater";

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow: BrowserWindow | null = null;
const isWindows = process.platform === "win32";
const dirName: string = __dirname;
initMenu();
initUpdaterMenuItems();

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webviewTag: true,
    },

    frame: !isWindows,
    height: 600,
    minHeight: 600,
    minWidth: 960,
    width: 960,

    icon: path.join(dirName, "./icons/png/256x256.png"),
    show: false,
    titleBarStyle: "hiddenInset",
    vibrancy: "dark",
  });

  // and load the index.html of the app.
  // mainWindow.loadFile('index.html')
  if (isDev) {
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadFile(path.join(dirName, "/../build/index.html"));
  }

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show();
    }
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
