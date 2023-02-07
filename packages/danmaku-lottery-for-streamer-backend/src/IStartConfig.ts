import { IGiftItem } from './IStatus'

export interface IStartConfig {
    targetCount: number
    normalPool: Array<IGiftItem>
    guardPool: Array<IGiftItem>
}