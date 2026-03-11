import { Point } from "../models/Point"

export class CollisionEngine {

  static isPointTouched(
    fingerX: number,
    fingerY: number,
    point: Point
  ): boolean {

    const dx = fingerX - point.x
    const dy = fingerY - point.y

    const distanceSquared = dx * dx + dy * dy
    const radiusSquared = point.radius * point.radius

    return distanceSquared <= radiusSquared
  }

}
