import { app, globalShortcut, protocol, Menu } from 'electron'
import {
  createProtocol
} from 'vue-cli-plugin-electron-builder/lib'
import beforeOpen from '~/main/utils/beforeOpen'
import fixPath from 'fix-path'
import ipcList from '~/main/events/ipcList'
import { IWindowList } from 'apis/app/window/constants'
import windowManager from 'apis/app/window/windowManager'
import updateChecker from '~/main/utils/updateChecker'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import db from '#/datastore'

const isDevelopment = process.env.NODE_ENV !== 'production'
class LifeCycle {
  private beforeReady () {
    protocol.registerSchemesAsPrivileged([
      { scheme: 'hvp', privileges: { secure: true, standard: true } }
    ])
    // fix the $PATH in macOS
    fixPath()
    beforeOpen()
    ipcList.listen()
  }
  private onReady () {
    app.on('ready', async () => {
      createProtocol('hvp')
      let menu = Menu.buildFromTemplate([])
      Menu.setApplicationMenu(menu)
      if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
          await installExtension(VUEJS_DEVTOOLS)
        } catch (e) {
          console.error('Vue Devtools failed to install:', e.toString())
        }
      }
      windowManager.create(IWindowList.MAIN_WINDOW)
      db.set('needReload', false)
      updateChecker()
    })
  }
  private onRunning () {
    app.on('activate', () => {
      createProtocol('hvp')
      if (!windowManager.has(IWindowList.MAIN_WINDOW)) {
        windowManager.create(IWindowList.MAIN_WINDOW)
      }
    })
    app.setLoginItemSettings({
      openAtLogin: db.get('settings.autoStart') || false
    })
    if (process.platform === 'win32') {
      app.setAppUserModelId('com.Lingyan000.hikerviewplayer')
    }

    if (
      process.env.XDG_CURRENT_DESKTOP &&
      process.env.XDG_CURRENT_DESKTOP.includes('Unity')
    ) {
      process.env.XDG_CURRENT_DESKTOP = 'Unity'
    }
  }
  private onQuit () {
    app.on('window-all-closed', () => {
      if (process.platform !== 'darwin') {
        app.quit()
      }
    })

    app.on('will-quit', () => {
      globalShortcut.unregisterAll()
    })
    // Exit cleanly on request from parent process in development mode.
    if (isDevelopment) {
      if (process.platform === 'win32') {
        process.on('message', (data) => {
          if (data === 'graceful-exit') {
            app.quit()
          }
        })
      } else {
        process.on('SIGTERM', () => {
          app.quit()
        })
      }
    }
  }
  launchApp () {
    const gotTheLock = app.requestSingleInstanceLock()
    if (!gotTheLock) {
      app.quit()
    } else {
      this.beforeReady()
      this.onReady()
      this.onRunning()
      this.onQuit()
    }
  }
}

const bootstrap = new LifeCycle()

export { bootstrap }
