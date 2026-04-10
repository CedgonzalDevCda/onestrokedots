import { Point } from "../models/Point"
import { CollisionEngine } from "./CollisionEngine"

type FingerPosition = {
  x: number
  y: number
}

export class PathEngine {

  points: Point[]
  visited: Record<string, number> = {}
  path: FingerPosition[] = []
  lastPosition: FingerPosition | null = null

  constructor(points: Point[]) {
    this.points = points
  }

  onFingerStart(x: number, y: number) {

    this.path = [{ x, y }]
    this.visited = {}
    this.lastPosition = { x, y }

    const point = CollisionEngine.detectTouchedPoint(x, y, this.points)

    if (point) {
      this.registerPointVisit(point)
    }

  }

onFingerMove(x: number, y: number) {

  console.log("Finger move:", x, y)

  this.path.push({ x, y })

  const point = CollisionEngine.detectTouchedPoint(x, y, this.points)

  if (point) {
    this.registerPointVisit(point)
  }

  this.lastPosition = { x, y }
}


  onFingerEnd() {

    console.log("Visited buttons :", this.visited)

    return {
      visited: this.visited,
      path: this.path
    }

  }

  private registerPointVisit(point: Point) {

    this.visited[point.id] = (this.visited[point.id] || 0) + 1

    console.log("Button visited:", point.id)
    console.log("Visited state:", this.visited)

  }

}
