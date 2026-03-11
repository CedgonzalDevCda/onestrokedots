import { Point } from "../models/Point"

export class Validator {

  static validate(points: Point[], visitedPoints: Point[]): boolean {

    const counter: Record<string, number> = {}

    // compter les passages
    visitedPoints.forEach(point => {

      if (!counter[point.id]) {
        counter[point.id] = 0
      }

      counter[point.id]++

    })

    // vérifier chaque point du niveau
    for (const point of points) {

      const visits = counter[point.id] || 0

      if (visits !== point.value) {
        return false
      }

    }

    return true
  }

}
