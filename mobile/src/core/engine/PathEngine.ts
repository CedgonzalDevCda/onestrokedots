import { Point } from "../models/Point"
import { CollisionEngine } from "./CollisionEngine"

type FingerPosition = {
  x: number
  y: number
}

export class PathEngine {

  points: Point[]
  visitedPoints: Point[] = []
  path: FingerPosition[] = []

  constructor(points: Point[]) {
    this.points = points
  }

  onFingerStart(x: number, y: number) {

    this.path = [{ x, y }]
    this.visitedPoints = []

    this.checkPointCollision(x, y)
  }

  onFingerMove(x: number, y: number) {

    this.path.push({ x, y })

    this.checkPointCollision(x, y)
  }

  onFingerEnd() {

    return {
      visitedPoints: this.visitedPoints,
      path: this.path
    }

  }

  private checkPointCollision(x: number, y: number) {

    this.points.forEach(point => {

      const alreadyVisited = this.visitedPoints.find(p => p.id === point.id)

      if (alreadyVisited) return

      const touched = CollisionEngine.isPointTouched(x, y, point)

      if (touched) {
        this.registerPointVisit(point)
      }

    })

  }

  private registerPointVisit(point: Point) {

    this.visitedPoints.push(point)

  }

}
