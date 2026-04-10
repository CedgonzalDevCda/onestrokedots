import { Point } from "@/src/game/models/Point"

export class Validator {

  static validate(
    points: Point[],
    visited: Record<string, number>
  ): boolean {

    for (const point of points) {

      const visits = visited[point.id] ?? 0

      if (visits !== point.value) {
        return false
      }

    }

    return true
  }

}
