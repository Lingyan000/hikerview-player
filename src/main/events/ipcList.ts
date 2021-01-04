import {
  Filter,
  ipcMain,
  IpcMainEvent,
  session,
  Notification
} from 'electron'

export default {
  listen () {
    ipcMain.on(
      'uploadRequestHeaders',
      async (evt: IpcMainEvent, filter: Filter, headers) => {
        try {
          session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            Object.keys(headers).forEach((key) => {
              details.requestHeaders[key] = headers[key]
            })
            let requestHeaders = { requestHeaders: details.requestHeaders }
            callback(requestHeaders)
          })
        } catch (e) {
          const notification = new Notification({
            title: '错误',
            body: '糟糕...发生了一些错误，可能是 headers 有误'
          })
          notification.show()
          throw new Error(e)
        }
      }
    )
  }
}
