import { Point } from "@/src/game/models/Point"
import { CollisionEngine } from "./CollisionEngine"

export class GameEngine {

  static processSegment(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    points: Point[],
    visited: Record<string, number>
  ): Record<string, number> {

    const point = CollisionEngine.detectSegmentHit(
      x1,
      y1,
      x2,
      y2,
      points
    )

    if (!point) return visited

    return {
      ...visited,
      [point.id]: (visited[point.id] || 0) + 1
    }
  }

}
