import { ValidationRule, ValidationContext } from "./ValidationRule"
import { EndPointParams } from "@/src/core/rules/LevelRuleConfig"

export class EndPointRule implements ValidationRule {
  validate(ctx: ValidationContext, params?: EndPointParams): boolean {
    if (!params) return true
    return ctx.visitOrder[ctx.visitOrder.length - 1] === params.pointId
  }
}