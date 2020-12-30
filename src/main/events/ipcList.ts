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
      async (evt: IpcMainEvent, filter: Filter, headersArr) => {
        try {
          session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
            headersArr.forEach((header: string) => {
              let headerArr = header.split('@')
              let index = headerArr[0]
              let value = headerArr[1].replace(/；；/g, ';').replace(/%%/g, ';').split('.js:')[0]
              details.requestHeaders[index] = value
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
