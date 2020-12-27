import { remote, app } from 'electron'
import pkg from 'root/package.json'

const APP = process.type === 'renderer' ? remote.app : app

function beforeOpen () {
  injectHvpVersion()
}

function injectHvpVersion () {
  global.HVP_GUI_VERSION = pkg.version
}

export default beforeOpen
