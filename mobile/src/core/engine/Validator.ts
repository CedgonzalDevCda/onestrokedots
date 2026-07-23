import { Point } from "@/src/core/models/Point"
import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig"
import { ValidationRule, ValidationContext } from "@/src/core/rules/ValidationRule"
import { VisitCountRule } from "@/src/core/rules/VisitCountRule"
import { NoBacktrackRule } from "@/src/core/rules/NoBacktrackRule"
import { StartPointRule } from "@/src/core/rules/StartPointRule"
import { EndPointRule } from "@/src/core/rules/EndPointRule"
import { MinStarsRule } from "@/src/core/rules/MinStarsRule"

export type ValidationResult =
  | { valid: true }
  | { valid: false; failedRule: string }

const RULES_REGISTRY: Record<string, ValidationRule> = {
  "visit-count": new VisitCountRule(),
  "no-backtrack": new NoBacktrackRule(),
  "start-point": new StartPointRule(),
  "end-point": new EndPointRule(),
  "min-stars": new MinStarsRule(),
  // "ordered-stars": new OrderedStarsRule(),
  // "avoid-zone": new AvoidZoneRule(),
  // "color-match": new ColorMatchRule(),
}

const DEFAULT_RULES: LevelRuleConfig[] = [
  { type: "visit-count" },
  { type: "no-backtrack" },
]

export class Validator {
  static validate(
    points: Point[],
    visited: Record<string, number>,
    visitOrder: string[],
    rules: LevelRuleConfig[] = DEFAULT_RULES,
    starsCollected?: string[]
  ): ValidationResult {
    const ctx: ValidationContext = { points, visited, visitOrder, starsCollected }

    for (const rule of rules) {
      const handler = RULES_REGISTRY[rule.type]

      if (!handler) {
        console.warn(`[Validator] Règle inconnue ignorée : "${rule.type}"`)
        continue
      }

      const params = "params" in rule ? rule.params : undefined

      if (!handler.validate(ctx, params)) {
        return { valid: false, failedRule: rule.type }
      }
    }

    return { valid: true }
  }
}