import { Level } from "./Level"

export type World = {
  id: string
  name: string
  LevelList: Level[]
  isAvailable: boolean
  isCompleted: boolean
}
