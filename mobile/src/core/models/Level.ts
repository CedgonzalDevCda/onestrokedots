import { Point } from "./Point"
import { Star } from "./Star"

export type Level = {
  id: string
  name: string
  isCompleted: boolean
  isAvailable: boolean
  PointList: Point[]
  StarList: Star[]
}
