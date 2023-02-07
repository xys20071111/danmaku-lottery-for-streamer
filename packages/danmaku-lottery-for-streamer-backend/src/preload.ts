import { contextBridge, ipcRenderer } from "electron"

contextBridge.exposeInMainWorld('ipc', {
    on: (eventName: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => { ipcRenderer.on(eventName, listener) },
    off: (eventName: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => { ipcRenderer.off(eventName, listener) },
    once: (eventName: string, listener: (event: Electron.IpcRendererEvent, ...args: any[]) => void) => { ipcRenderer.once(eventName, listener) },
    removeAllListener: (eventName: string) => { ipcRenderer.removeAllListeners(eventName) },
    send: ipcRenderer.send,
    ipcRenderer
})

contextBridge.exposeInMainWorld('development', process.env.NODE_ENV === 'development')
