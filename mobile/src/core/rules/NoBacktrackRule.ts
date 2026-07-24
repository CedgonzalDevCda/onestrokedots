import { ValidationRule, ValidationContext } from "./ValidationRule"

export class NoBacktrackRule implements ValidationRule {
  validate(ctx: ValidationContext): boolean {
    const order = ctx.visitOrder

    for (let i = 1; i < order.length; i++) {
      if (order[i] === order[i - 1]) {
        return false
      }
    }

    return true
  }
}