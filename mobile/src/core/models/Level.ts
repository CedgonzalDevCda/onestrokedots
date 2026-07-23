import { Point } from "./Point"
import { Star } from "./Star"
import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig"

export type Level = {
  id: string
  name: string
  isCompleted: boolean
  isAvailable: boolean
  rules?: LevelRuleConfig[]
  PointList: Point[]
  StarList: Star[]
}