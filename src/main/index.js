import { app, BrowserWindow } from 'electron'
import config from "../config.json"
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow() {
  /**   
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    transparent: true,
    // height: config.system["player-mini-height"] + config.system["player-mini-padding"]*2,
    // useContentSize: true,
    height: config.system.height,
    width: config.system.width,
    webPreferences: { webSecurity: false },
    // width: config.system["player-mini-width"] + config.system["player-mini-padding"]*2,
    frame: false,
    maximizable: false,
    resizable: false,
    transparent: true
  })
  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}
// require('electron-debug')({ showDevTools: true })

app.on('ready', createWindow)

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
