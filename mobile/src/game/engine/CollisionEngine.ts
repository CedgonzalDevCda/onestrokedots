import { Point } from "@/src/game/models/Point"

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

  static detectTouchedPoint(
    fingerX: number,
    fingerY: number,
    points: Point[]
  ): Point | null {

    for (const p of points) {
      if (this.isPointTouched(fingerX, fingerY, p)) {
        return p
      }
    }

    return null
  }

  static segmentIntersectsCircle(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    point: Point
  ): boolean {

    const cx = point.x
    const cy = point.y
    const r = point.radius

    const dx = x2 - x1
    const dy = y2 - y1

    const fx = x1 - cx
    const fy = y1 - cy

    const a = dx * dx + dy * dy
    const b = 2 * (fx * dx + fy * dy)
    const c = fx * fx + fy * fy - r * r

    let discriminant = b * b - 4 * a * c

    if (discriminant < 0) return false

    discriminant = Math.sqrt(discriminant)

    const t1 = (-b - discriminant) / (2 * a)
    const t2 = (-b + discriminant) / (2 * a)

    if (t1 >= 0 && t1 <= 1) return true
    if (t2 >= 0 && t2 <= 1) return true

    return false
  }

  static detectSegmentHit(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    points: Point[]
  ): Point | null {

    for (const p of points) {
      if (this.segmentIntersectsCircle(x1, y1, x2, y2, p)) {
        return p
      }
    }

    return null
  }

}
