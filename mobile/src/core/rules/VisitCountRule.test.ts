// src/core/rules/VisitCountRule.test.ts
import { VisitCountRule } from "@/src/core/rules/VisitCountRule"
import { ValidationContext } from "@/src/core/rules/ValidationRule"
import { Point } from "@/src/core/models/Point"

describe("VisitCountRule", () => {
  const rule = new VisitCountRule()

  const buildContext = (
    points: Point[],
    visited: Record<string, number>
  ): ValidationContext => ({
    points,
    visited,
    visitOrder: [],
  })

  it("should return true when every point's visit count matches its required value", () => {
    // Arrange
    const points = [
      { id: "p1", x: 0, y: 0, value: 1 },
      { id: "p2", x: 1, y: 1, value: 2 },
    ] as any
    const ctx = buildContext(points, { p1: 1, p2: 2 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(true)
  })

  it("should return true for an empty points array regardless of visited map", () => {
    // Arrange
    const ctx = buildContext([], { p1: 5 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(true)
  })

  it("should treat a missing entry in visited as 0 visits", () => {
    // Arrange
    const points = [{ id: "p1", x: 0, y: 0, value: 0 }] as any
    const ctx = buildContext(points, {})

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(true)
  })

  it("should return false when a point has fewer visits than required", () => {
    // Arrange
    const points = [{ id: "p1", x: 0, y: 0, value: 2 }] as any
    const ctx = buildContext(points, { p1: 1 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(false)
  })

  it("should return false when a point has more visits than required", () => {
    // Arrange
    const points = [{ id: "p1", x: 0, y: 0, value: 1 }] as any
    const ctx = buildContext(points, { p1: 3 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(false)
  })

  it("should return false as soon as one point among several mismatches, even if others match", () => {
    // Arrange
    const points = [
      { id: "p1", x: 0, y: 0, value: 1 },
      { id: "p2", x: 1, y: 1, value: 1 },
      { id: "p3", x: 2, y: 2, value: 1 },
    ] as any
    // p2 mismatches (0 visits instead of 1), p1 and p3 are fine
    const ctx = buildContext(points, { p1: 1, p3: 1 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(false)
  })

  it("should return false when a point is required 0 times but was visited at least once", () => {
    // Arrange
    const points = [{ id: "p1", x: 0, y: 0, value: 0 }] as any
    const ctx = buildContext(points, { p1: 1 })

    // Act
    const result = rule.validate(ctx)

    // Assert
    expect(result).toBe(false)
  })

  it("should not mutate the points array or the visited map", () => {
    // Arrange
    const points = [{ id: "p1", x: 0, y: 0, value: 1 }] as any
    const visited = { p1: 1 }
    const pointsCopy = JSON.parse(JSON.stringify(points))
    const visitedCopy = { ...visited }
    const ctx = buildContext(points, visited)

    // Act
    rule.validate(ctx)

    // Assert
    expect(points).toEqual(pointsCopy)
    expect(visited).toEqual(visitedCopy)
  })
})