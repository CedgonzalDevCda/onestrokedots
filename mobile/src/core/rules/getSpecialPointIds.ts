// src/core/rules/getSpecialPointIds.ts
import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig"

export type SpecialPointsMap = {
  startPointIds: Set<string>
  endPointIds: Set<string>
}

export function getSpecialPointIds(rules: LevelRuleConfig[] = []): SpecialPointsMap {
  const startPointIds = new Set<string>()
  const endPointIds = new Set<string>()

  for (const rule of rules) {
    if (rule.type === "start-point") {
      startPointIds.add(rule.params.pointId)
    }
    if (rule.type === "end-point") {
      endPointIds.add(rule.params.pointId)
    }
  }

  return { startPointIds, endPointIds }
}