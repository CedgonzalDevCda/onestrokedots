// src/core/rules/EndPointRule.test.ts
import { EndPointRule } from "@/src/core/rules/EndPointRule"
import { ValidationContext } from "@/src/core/rules/ValidationRule"
import { EndPointParams } from "@/src/core/rules/LevelRuleConfig"

describe("EndPointRule", () => {
  const rule = new EndPointRule()

  const buildContext = (visitOrder: string[]): ValidationContext => ({
    points: [],
    visited: {},
    visitOrder,
  })

  it("should return true when params are not provided (no constraint enforced)", () => {
    // Arrange
    const ctx = buildContext(["p1", "p2"])

    // Act
    const result = rule.validate(ctx, undefined)

    // Assert
    expect(result).toBe(true)
  })

  it("should return true when the last visited point matches the required end point", () => {
    // Arrange
    const ctx = buildContext(["p1", "p2", "p3"])
    const params: EndPointParams = { pointId: "p3" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(true)
  })

  it("should return false when the last visited point does not match the required end point", () => {
    // Arrange
    const ctx = buildContext(["p1", "p2"])
    const params: EndPointParams = { pointId: "p3" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(false)
  })

  it("should return false when visitOrder is empty and params are provided", () => {
    // Arrange
    const ctx = buildContext([])
    const params: EndPointParams = { pointId: "p3" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    // last element of an empty array is undefined, which !== "p3"
    expect(result).toBe(false)
  })

  it("should return true when visitOrder has a single element matching the end point", () => {
    // Arrange
    const ctx = buildContext(["p3"])
    const params: EndPointParams = { pointId: "p3" }

    // Act
    const result = rule.validate(ctx, params)

    // Assert
    expect(result).toBe(true)
  })

  it("should not mutate the visitOrder array", () => {
    // Arrange
    const visitOrder = ["p1", "p2", "p3"]
    const original = [...visitOrder]
    const ctx = buildContext(visitOrder)
    const params: EndPointParams = { pointId: "p3" }

    // Act
    rule.validate(ctx, params)

    // Assert
    expect(visitOrder).toEqual(original)
  })
})