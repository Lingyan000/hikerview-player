export enum IWindowList {
  MAIN_WINDOW = 'MAIN_WINDOW',
}

const isDevelopment = process.env.NODE_ENV !== 'production'

export const MAIN_WINDOW_URL = isDevelopment
  ? (process.env.WEBPACK_DEV_SERVER_URL as string)
  : `hvp://./index.html`
