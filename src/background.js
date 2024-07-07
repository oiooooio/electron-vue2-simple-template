'use strict'

import { app, BrowserWindow, ipcMain, protocol } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import { startPrint } from './electron-print-preview/dist/print/index'
const path = require('path')
const fs = require('fs')

const isDevelopment = process.env.NODE_ENV !== 'production'

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: 'app', privileges: { secure: true, standard: true }}
])

let icon = null
if (process.env.WEBPACK_DEV_SERVER_URL) {
    icon = path.join(__dirname, '../public/icon.png')
} else {
    icon = path.join(process.cwd(), '/resources/icon.png')
}

function readTestWebPage() {
    // 构建文件路径
    const filePath = path.join(__dirname, 'test', 'print-test-page.html')

    // 读取文件内容
    let fileContent
    try {
        fileContent = fs.readFileSync(filePath, 'utf-8')
        return fileContent
    } catch (err) {
        console.error('Error reading file:', err)
    }
}

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1920,
        height: 1080,
        show: false,
        icon: icon,
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            // nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
            // contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
            preload: path.join(__dirname, 'preload.js')
            // nativeWindowOpen: true // 拦截 new-window 事件
        }
    })
    win.center()
    // updateHandle(win);

    win.webContents.on('did-finish-load', async() => {
        if (!win) {
            throw new Error('"win" is not defined')
        }
        console.log('did-finish-load')
        setTimeout(function() {
            if (process.env.START_MINIMIZED) {
                win.minimize()
            } else {
                win.show()
                // win.maximize()
                win.focus()
            }
            // childWin.hide()
        }, 500)

        ipcMain.on('print', async (event, html) => {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return

            try {
                startPrint({ htmlString: html }, null)
            } catch (error) {
                console.error('Error during print:', error)
            }
        })

        ipcMain.on('print-test-web-page', async (event) => {
            const win = BrowserWindow.getFocusedWindow()
            if (!win) return

            try {
                const html = readTestWebPage()
                startPrint({ htmlString: html }, null)
            } catch (error) {
                console.error('Error during print:', error)
            }
        })
    })
    if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
        if (!process.env.IS_TEST) win.webContents.openDevTools()
    } else {
        createProtocol('app')
        // Load the index.html when not in development
        win.loadURL('app://./index.html')
    }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async() => {
    if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    }
    createWindow()
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
