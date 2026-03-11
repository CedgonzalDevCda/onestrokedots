import { Point } from "./Point"

export type Level = {
  id: string
  name: string
  isCompleted: boolean
  isAvailable: boolean
  PointList: Point[]
}
