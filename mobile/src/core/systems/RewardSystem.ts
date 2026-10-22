// src/core/systems/RewardSystem.ts
import { Level } from "@/src/core/models/Level"

export interface LevelReward {
  gold: number
}

export const REWARD_CONFIG = {
  baseGoldPerStar: 10,
  pointsWeight: 0.08,
  valueWeight: 0.03,
  orderedStarsBonus: 0.4,
  maxMultiplier: 3,
} as const

export function calculateLevelReward(level: Level, starsEarned: number): LevelReward {
  const multiplier = getDifficultyMultiplier(level)
  const gold = Math.round(starsEarned * REWARD_CONFIG.baseGoldPerStar * multiplier)

  return { gold }
}

function getDifficultyMultiplier(level: Level): number {
  const pointsCount = level.PointList?.length ?? 0

  const totalValue = (level.PointList ?? []).reduce(
    (sum, p) => sum + (p.value ?? 0),
    0
  )

  const hasOrderedStars = (level.rules ?? []).some(
    (r) => r.type === "ordered-stars"
  )

  const multiplier =
    1 +
    pointsCount * REWARD_CONFIG.pointsWeight +
    totalValue * REWARD_CONFIG.valueWeight +
    (hasOrderedStars ? REWARD_CONFIG.orderedStarsBonus : 0)

  return Math.min(multiplier, REWARD_CONFIG.maxMultiplier)
}