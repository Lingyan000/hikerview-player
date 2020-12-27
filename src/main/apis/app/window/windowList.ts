import {
  IWindowList,
  MAIN_WINDOW_URL
} from './constants'
import { IWindowListItem } from '#/types/electron'

const windowList = new Map<IWindowList, IWindowListItem>()

windowList.set(IWindowList.MAIN_WINDOW, {
  isValid: process.platform !== 'linux',
  multiple: false,
  options () {
    return {
      height: 600,
      width: 800,
      show: true,
      frame: true,
      fullscreenable: true,
      resizable: true,
      transparent: false,
      vibrancy: 'ultra-dark',
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        backgroundThrottling: false
      },
      icon: `${__static}/app.ico`
    }
  },
  callback (window) {
    if (process.env.WEBPACK_DEV_SERVER_URL && !process.env.IS_TEST) window.webContents.openDevTools()
    window.loadURL(MAIN_WINDOW_URL)
  }
})

export default windowList
