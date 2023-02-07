import { BrowserWindow, app, Menu, ipcMain } from 'electron'
import express from 'express'
import { Server } from 'ws'
import path from 'path'
import process from 'process'
import http from 'http'
import DanmakuReceiver from './danmakuReceiver'
import { IGiftItem, IStatus } from './IStatus'
import { IStartConfig } from './IStartConfig'
import { choose } from './lotteryFunctions'

const status: IStatus = {
    currentDanmakuCount: 0,
    targetDanmakuCount: 0,
    guardGiftPool: [],
    normalGiftPool: [],
    guardSummary: [],
    normalSummary: [],
    guardLatestSelected: -1,
    normalLatestSelected: -1
}

let mainWindow: BrowserWindow
const overlayApp = express()
overlayApp.use(express.static(path.resolve(__dirname, 'overlay')))
const server = http.createServer(overlayApp)
const danmakuReceiver = new DanmakuReceiver()
const wsServer = new Server({ server })
const normalGiftPool: Array<number> = []

danmakuReceiver.on('DANMU_MSG', () => {
    status.currentDanmakuCount++
    if (status.currentDanmakuCount >= status.targetDanmakuCount && status.targetDanmakuCount > 0) {
        try {
            const choice = choose(status.normalGiftPool)
            status.normalLatestSelected = choice
            status.normalSummary.push(status.normalGiftPool[choice].name)
            status.currentDanmakuCount = 0
        } catch {}
    }
})

danmakuReceiver.on('GUARD_BUY', () => {
    if (status.guardGiftPool.length !== 0) {
        const choice = choose(status.guardGiftPool)
        status.guardLatestSelected = choice
        status.guardSummary.push(status.guardGiftPool[choice].name)
    }
})

ipcMain.on('roll-normal', (_) => {
    try {
        const choice = choose(status.normalGiftPool)
        status.normalLatestSelected = choice
        status.normalSummary.push(status.normalGiftPool[choice].name)
        status.currentDanmakuCount = 0
    } catch {}
    
})

ipcMain.on('roll-guard', (_) => {
    if (status.guardGiftPool.length !== 0) {
        const choice = choose(status.guardGiftPool)
        status.guardLatestSelected = choice
        status.guardSummary.push(status.guardGiftPool[choice].name)
    }
})

ipcMain.on('connect-danmaku', (_, roomId: number) => {
    danmakuReceiver.setRoomId(roomId)
    danmakuReceiver.connect()
})

ipcMain.on('disconnect-danmaku', (_) => {
    danmakuReceiver.close()
})

ipcMain.on('update-normal-pool', (_, targetNum: number, pool: string) => {
    status.targetDanmakuCount = targetNum
    normalGiftPool.length = 0
    const newPool: Array<IGiftItem> = JSON.parse(pool)
    for (let i = 0; i < status.normalGiftPool.length; i++) {
        const item = newPool[i]
        for (let j = 0; j < item.chance; j++) {
            normalGiftPool.push(i)
        }
    }
    status.normalGiftPool = newPool.slice()
})

ipcMain.on('update-guard-pool', (_, pool: string) => {
    const newPool: Array<IGiftItem> = JSON.parse(pool)
    status.guardGiftPool = newPool.slice()
})


ipcMain.on('mock-start', () => {
    const lotteryConfig: IStartConfig = {
        targetCount: 5,
        normalPool: [],
        guardPool: [
            {
                name: 'test1',
                chance: 0
            },
            {
                name: 'test2',
                chance: 0
            },
            {
                name: 'test3',
                chance: 0
            },
            {
                name: 'test4',
                chance: 0
            },
            {
                name: 'test5',
                chance: 0
            },
            {
                name: 'test6',
                chance: 0
            }
        ]
    }
    status.currentDanmakuCount = 0
    status.targetDanmakuCount = lotteryConfig.targetCount
    status.guardGiftPool = lotteryConfig.guardPool.slice()
    status.normalGiftPool = lotteryConfig.normalPool.slice()
    status.guardSummary.length = 0
    status.normalSummary.length = 0
    status.guardLatestSelected = -1
    status.normalLatestSelected = -1
})

setInterval(() => {
    wsServer.clients.forEach((client) => {
        client.send(JSON.stringify(status))
    })
}, 500)

app.whenReady().then(() => {
    Menu.setApplicationMenu(null)
    mainWindow = new BrowserWindow({
        width: 1024,
        height: 768,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.resolve(__dirname, 'preload.js')
        }
    })
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173/')
        mainWindow.webContents.on('before-input-event', (_, input) => {
            if (input.key === ')' && input.control && input.shift) {
                mainWindow.webContents.openDevTools()
            }
        })
    } else {
        mainWindow.loadFile(path.resolve(__dirname, 'ui/index.html'))
    }
    server.listen(4561)

})
