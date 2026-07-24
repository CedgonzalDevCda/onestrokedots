import { Point } from "@/src/core/models/Point"

export type ValidationContext = {
  points: Point[]
  visited: Record<string, number>
  visitOrder: string[]
  starsCollected?: string[]
}

export interface ValidationRule {
  validate(ctx: ValidationContext, params?: unknown): boolean
}