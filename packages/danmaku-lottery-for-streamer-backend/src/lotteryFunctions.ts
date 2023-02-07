export function normalLottery() {
    //TODO: 看一下加权抽奖的写法
}

export function choose(giftPool: Array<any>): number {
    return Math.ceil(Math.random() * 1000000) % giftPool.length
}