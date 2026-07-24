import { Level } from "./Level"

export interface World {
  id: string
  name: string
  levelList: Level[]
}
