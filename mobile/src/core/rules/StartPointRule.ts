import { ValidationRule, ValidationContext } from "./ValidationRule"
import { StartPointParams } from "@/src/core/rules/LevelRuleConfig"

export class StartPointRule implements ValidationRule {
  validate(ctx: ValidationContext, params?: StartPointParams): boolean {
    if (!params) return true
    return ctx.visitOrder[0] === params.pointId
  }
}