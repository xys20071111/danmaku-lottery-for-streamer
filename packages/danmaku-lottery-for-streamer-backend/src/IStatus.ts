export interface IGiftItem {
    name: string
    chance: number
}

export interface IStatus {
    currentDanmakuCount: number
    targetDanmakuCount: number
    normalGiftPool: Array<IGiftItem>
    guardGiftPool: Array<IGiftItem>
    guardSummary: Array<string>
    normalSummary: Array<string>
    normalLatestSelected: number
    guardLatestSelected: number
}