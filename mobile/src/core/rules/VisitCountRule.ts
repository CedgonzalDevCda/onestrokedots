import { ValidationRule, ValidationContext } from "./ValidationRule"

export class VisitCountRule implements ValidationRule {
  validate(ctx: ValidationContext): boolean {
    for (const point of ctx.points) {
      const visits = ctx.visited[point.id] ?? 0
      if (visits !== point.value) {
        return false
      }
    }
    return true
  }
}