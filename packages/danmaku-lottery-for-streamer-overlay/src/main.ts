import { IStatus } from './IStatus'

const wsClient = new WebSocket("ws://localhost:4561")

const guardGiftPool: Array<HTMLSpanElement> = []
const normalGiftPool: Array<HTMLSpanElement> = []
const currentDanmakuCountSpan: HTMLSpanElement = document.getElementById('current-danmaku') as HTMLSpanElement
const targetDanmakuCountSpan: HTMLSpanElement = document.getElementById('target-danmaku') as HTMLSpanElement
const guardGiftPoolDiv: HTMLDivElement = document.getElementById('guard-pool-content') as HTMLDivElement
const normalGiftPoolDiv: HTMLDivElement = document.getElementById('normal-pool-content') as HTMLDivElement
const counterProgressBar: HTMLProgressElement = document.getElementById('counter-progress') as HTMLProgressElement
const normalPoolSummaryDiv: HTMLDivElement = document.getElementById('normal-pool-summary') as HTMLDivElement
const guardPoolSummaryDiv: HTMLDivElement = document.getElementById('guard-pool-summary') as HTMLDivElement

wsClient.addEventListener('message', (event) => {
    const currentStatus: IStatus = JSON.parse(event.data)
    console.log(currentStatus)
    guardGiftPool.length = 0
    normalGiftPool.length = 0
    counterProgressBar.max = currentStatus.targetDanmakuCount
    counterProgressBar.value = currentStatus.currentDanmakuCount
    currentDanmakuCountSpan.innerText = currentStatus.currentDanmakuCount.toString()
    targetDanmakuCountSpan.innerText = currentStatus.targetDanmakuCount.toString()
    guardGiftPoolDiv.innerHTML = ""
    normalGiftPoolDiv.innerHTML = ""
    normalPoolSummaryDiv.innerHTML = ""
    guardPoolSummaryDiv.innerHTML = ""
    for(const item of currentStatus.guardGiftPool) {
        const itemSpan = document.createElement('span')
        const br = document.createElement('br')
        itemSpan.innerText = item.name
        itemSpan.className = 'unselected-item'
        guardGiftPoolDiv.appendChild(itemSpan)
        guardGiftPoolDiv.appendChild(br)
        guardGiftPool.push(itemSpan)
    }
    for(const item of currentStatus.normalGiftPool) {
        const itemSpan = document.createElement('span')
        const br = document.createElement('br')
        itemSpan.innerText = item.name
        itemSpan.className = 'unselected-item'
        normalGiftPoolDiv.appendChild(itemSpan)
        normalGiftPoolDiv.appendChild(br)
        normalGiftPool.push(itemSpan)
    }
    for(const item of currentStatus.normalSummary) {
        const itemSpan = document.createElement('span')
        const br = document.createElement('br')
        itemSpan.innerText = item
        normalPoolSummaryDiv.appendChild(itemSpan)
        normalPoolSummaryDiv.appendChild(br)
    }
    for(const item of currentStatus.guardSummary) {
        const itemSpan = document.createElement('span')
        const br = document.createElement('br')
        itemSpan.innerText = item
        guardPoolSummaryDiv.appendChild(itemSpan)
        guardPoolSummaryDiv.appendChild(br)
    }
    if(currentStatus.guardLatestSelected !== -1) {
        guardGiftPool[currentStatus.guardLatestSelected].className = 'selected-item'
    }
    if(currentStatus.guardLatestSelected !== -1) {
        guardGiftPool[currentStatus.guardLatestSelected].className = 'selected-item'
    }
    const endPointA = document.createElement('div')
    const endPointB = document.createElement('div')
    normalPoolSummaryDiv.appendChild(endPointA)
    guardPoolSummaryDiv.appendChild(endPointB)
    endPointA.scrollIntoView()
    endPointB.scrollIntoView()
})