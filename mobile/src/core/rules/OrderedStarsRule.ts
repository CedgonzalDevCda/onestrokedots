// src/core/rules/OrderedStarsRule.ts
import { ValidationContext, ValidationRule } from "./ValidationRule"
import { OrderedStarsParams } from "@/src/core/rules/LevelRuleConfig"

export class OrderedStarsRule implements ValidationRule {
  validate(ctx: ValidationContext, params?: OrderedStarsParams): boolean {
    if (!params || !ctx.starsCollected) return true
    
    const expectedOrder = params.order
    const collectedStars = ctx.starsCollected
    
    let orderIndex = 0
    for (const starId of collectedStars) {
      if (orderIndex < expectedOrder.length && starId === expectedOrder[orderIndex]) {
        orderIndex++
      }
    }
    
    return orderIndex === expectedOrder.length
  }
}