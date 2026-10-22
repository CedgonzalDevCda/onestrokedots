import { ValidationRule, ValidationContext } from "./ValidationRule"
import { MinStarsParams } from "@/src/core/rules/LevelRuleConfig"

export class MinStarsRule implements ValidationRule {
  validate(ctx: ValidationContext, params?: MinStarsParams): boolean {
    if (!params) return true

    const collected = ctx.visitOrder.filter((id) => ctx.starsCollected?.includes(id)).length

    return collected >= params.qty
  }
}