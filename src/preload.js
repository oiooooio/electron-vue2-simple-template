// console.log('预加载文件执行')
const { contextBridge, ipcRenderer } = require('electron')

// 暴露给前端方法
contextBridge.exposeInMainWorld('electronAPI', {

    print: (html) => {
        ipcRenderer.send('print', html)
    }
})

console.log('preload.js')
