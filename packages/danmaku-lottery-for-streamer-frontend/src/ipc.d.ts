export interface ipcRenderer {
  on: (eventName: string, handler: (...args) => void) => void,
  off: (eventName: string, handler: (...args) => void) => void,
  once: (eventName: string, handler: (...args) => void) => void,
  send: (eventName: string, ...args) => void,
  removeAllListener: (eventName: string) => void
}

declare global {
  // eslint-disable-next-line no-unused-expressions
  interface Window {
    ipc: ipcRenderer
    development: boolean
  }
}
