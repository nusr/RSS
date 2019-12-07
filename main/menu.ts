import {
  app,
  BrowserWindow,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  shell,
} from 'electron'
import { checkForUpdates, restartToUpdate, UPDATER_STATUS_MAP } from './updater'

const template: MenuItemConstructorOptions[] = [
  {
    label: 'Subscriptions',
    submenu: [
      {
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('IMPORT_FORM_OPML')
          }
        },
        label: 'Import from OPML',
      },
      {
        click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
          if (browserWindow) {
            browserWindow.webContents.send('EXPORT_TO_OPML')
          }
        },
        label: 'Export to OPML',
      },
    ],
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [
      {
        click: () => {
          shell.openExternal('https://github.com/nusr/RSS')
        },
        label: 'Learn More',
      },
      {
        accelerator: 'CmdOrCtrl+Alt+I',
        label: 'Toggle Developer Tools',
        role: 'toggleDevTools',
      },
    ],
  },
]

function addAboutMenuItem(
  items: MenuItemConstructorOptions[],
  position: number
) {
  const aboutItem: MenuItemConstructorOptions = {
    label: `About ${app.name}`,
    role: 'about',
  }
  items.splice.apply(items, [position, 0, aboutItem])
}

function addUpdateMenuItems(
  items: MenuItemConstructorOptions[],
  position: number
) {
  if (process.mas) {
    return
  }

  const updateItems: MenuItemConstructorOptions[] = [
    {
      click: checkForUpdates,
      enabled: true,
      id: UPDATER_STATUS_MAP.NORMAL,
      label: 'Check for Updates',
      visible: true,
    },
    {
      enabled: false,
      id: UPDATER_STATUS_MAP.CHECKING,
      label: 'Checking updates...',
      visible: false,
    },
    {
      enabled: false,
      id: UPDATER_STATUS_MAP.DOWNLOADING,
      label: 'Downloading updates...',
      visible: false,
    },
    {
      enabled: false,
      id: UPDATER_STATUS_MAP.ERROR,
      label: 'Update Failed',
      visible: false,
    },
    {
      click: restartToUpdate,
      enabled: true,
      id: UPDATER_STATUS_MAP.READY,
      label: 'Restart to update',
      visible: false,
    },
  ]

  items.splice.apply(items, [position, 0, ...updateItems])
}

function addPreferencesMenu(
  menus: MenuItemConstructorOptions[],
  position: number
) {
  const settingsMenu = {
    click: (menuItem: MenuItem, browserWindow: BrowserWindow) => {
      if (browserWindow) {
        browserWindow.webContents.send('SETTINGS_MODAL', 'OPEN')
      }
    },
    label: 'Settings',
  }
  menus.splice.apply(menus, [position, 0, settingsMenu])
}

if (process.platform === 'darwin') {
  const appName = app.name
  template.unshift({
    label: appName,
    submenu: [
      {
        type: 'separator',
      },
      {
        label: 'Services',
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        accelerator: 'Command+H',
        label: `Hide ${appName}`,
        role: 'hide',
      },
      {
        accelerator: 'Command+Alt+H',
        label: 'Hide Others',
        role: 'hideOthers',
      },
      {
        label: 'Show All',
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        accelerator: 'Command+Q',
        click: () => {
          app.quit()
        },
        label: 'Quit',
      },
    ],
  })
  addAboutMenuItem(template[0].submenu as MenuItemConstructorOptions[], 0)
  addPreferencesMenu(template[0].submenu as MenuItemConstructorOptions[], 1)
  addUpdateMenuItems(template[0].submenu as MenuItemConstructorOptions[], 1)
}

if (process.platform === 'win32' || process.platform === 'linux') {
  const helpMenu = template[template.length - 1].submenu
  addPreferencesMenu(template, template.length - 1)
  addUpdateMenuItems(helpMenu as MenuItemConstructorOptions[], 0)
}

export function initMenu() {
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
