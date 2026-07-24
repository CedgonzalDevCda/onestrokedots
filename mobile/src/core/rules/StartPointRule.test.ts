// src/core/rules/StartPointRule.test.ts
import { StartPointRule } from "@/src/core/rules/StartPointRule"
import { ValidationContext } from "@/src/core/rules/ValidationRule"
import { StartPointParams } from "@/src/core/rules/LevelRuleConfig"

describe("StartPointRule", () => {
  const rule = new StartPointRule()

  const buildContext = (visitOrder: string[]): ValidationContext => ({
    points: [],
    visited: {},
    visitOrder,
  })

  it("should return true when params are not provided (no constraint enforced)", () => {
    // Arrange
    const ctx = buildContext(["p2", "p1"])

    // Act
    const result = rule.validate(ctx, undefined)

    // Assert
    expect(result).toBe(true)
  })

  it("should return true when the first visited point matches the required start point", () => {
    // Arrange
    const ctx = buildContext(["p1", "p2"])
    const params: StartPointParams = { pointId: "p1" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(true)
  })

  it("should return false when the first visited point does not match the required start point", () => {
    // Arrange
    const ctx = buildContext(["p2", "p1"])
    const params: StartPointParams = { pointId: "p1" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(false)
  })

  it("should return false when visitOrder is empty and params are provided", () => {
    // Arrange
    const ctx = buildContext([])
    const params: StartPointParams = { pointId: "p1" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(false)
  })

  it("should not mutate the visitOrder array", () => {
    // Arrange
    const visitOrder = ["p1", "p2"]
    const original = [...visitOrder]
    const ctx = buildContext(visitOrder)
    const params: StartPointParams = { pointId: "p1" }

    // Act
    rule.validate(ctx, params)

    // Assert
    expect(visitOrder).toEqual(original)
  })
})