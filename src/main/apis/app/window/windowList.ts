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
    const options: IBrowserWindowOptions = {
      height: 600,
      width: 800,
      show: true,
      frame: true,
      center: true,
      fullscreenable: true,
      resizable: true,
      title: '海阔视界播放器',
      // vibrancy: 'ultra-dark',
      // transparent: true,
      // titleBarStyle: 'hidden',
      webPreferences: {
        backgroundThrottling: false,
        nodeIntegration: true,
        nodeIntegrationInWorker: true,
        webSecurity: false
      }
    }
    if (process.platform !== 'darwin') {
      options.backgroundColor = '#3f3c37'
      options.transparent = false
      options.icon = `${__static}/app.ico`
    }
    return options
  },
  callback (window) {
    if (process.env.WEBPACK_DEV_SERVER_URL && !process.env.IS_TEST) window.webContents.openDevTools()
    window.loadURL(MAIN_WINDOW_URL)
  }
})

export default windowList
