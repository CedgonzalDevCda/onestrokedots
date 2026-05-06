import { useState } from "react"
import { Point } from "@/src/core/models/Point"
import { Validator } from "@/src/core/engine/Validator"

type Vec = { x: number; y: number }

type Star = {
  id: string
  x: number
  y: number
  size: number
}

const EPS = 1e-6

export function useGame(
  points: Point[],
  stars: Star[],
  collectedStars: Record<string, boolean>,
  setCollectedStars: React.Dispatch<React.SetStateAction<Record<string, boolean>>>
) {
  const [path, setPath] = useState<Vec[]>([])
  const [visited, setVisited] = useState<Record<string, number>>({})
  const [inside, setInside] = useState<Record<string, boolean>>({})
  const [lastPos, setLastPos] = useState<Vec | null>(null)
  const [lost, setLost] = useState(false)

  const isPathValid = points.every(p => (visited[p.id] ?? 0) === p.value)

  // ---------------- GEOMETRY ----------------

  function orientation(a: Vec, b: Vec, c: Vec): 0 | 1 | 2 {
    const val = (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y)
    if (Math.abs(val) < EPS) return 0
    return val > 0 ? 1 : 2
  }

  function pointOnSegment(a: Vec, b: Vec, p: Vec) {
    return (
      Math.min(a.x, b.x) - EPS <= p.x &&
      p.x <= Math.max(a.x, b.x) + EPS &&
      Math.min(a.y, b.y) - EPS <= p.y &&
      p.y <= Math.max(a.y, b.y) + EPS
    )
  }

  function segmentsIntersectSimple(a: Vec, b: Vec, c: Vec, d: Vec): boolean {
    const o1 = orientation(a, b, c)
    const o2 = orientation(a, b, d)
    const o3 = orientation(c, d, a)
    const o4 = orientation(c, d, b)

    if (o1 !== o2 && o3 !== o4) return true
    if (o1 === 0 && pointOnSegment(a, b, c)) return true
    if (o2 === 0 && pointOnSegment(a, b, d)) return true
    if (o3 === 0 && pointOnSegment(c, d, a)) return true
    if (o4 === 0 && pointOnSegment(c, d, b)) return true

    return false
  }

  function segmentIntersectionPoint(a: Vec, b: Vec, c: Vec, d: Vec): Vec | null {
    const A1 = b.y - a.y
    const B1 = a.x - b.x
    const C1 = A1 * a.x + B1 * a.y

    const A2 = d.y - c.y
    const B2 = c.x - d.x
    const C2 = A2 * c.x + B2 * c.y

    const det = A1 * B2 - A2 * B1
    if (Math.abs(det) < EPS) return null

    return {
      x: (B2 * C1 - B1 * C2) / det,
      y: (A1 * C2 - A2 * C1) / det,
    }
  }

  function pointInsideAnyCircle(p: Vec, circles: Point[]) {
    return circles.some(c => Math.hypot(p.x - c.x, p.y - c.y) <= c.radius + EPS)
  }

  function bothSegmentsInsideSameCircle(
    a: Vec,
    b: Vec,
    c: Vec,
    d: Vec,
    circles: Point[]
  ) {
    return circles.some(circle => {
      const inside = (p: Vec) =>
        Math.hypot(p.x - circle.x, p.y - circle.y) <= circle.radius + EPS
      return inside(a) && inside(b) && inside(c) && inside(d)
    })
  }

  function markLostAndReset() {
    setLost(true)
    resetAll()
  }

  // ---------------- STARS ----------------

  function checkStars(x: number, y: number) {
    if (!isPathValid) return

    stars.forEach(star => {
      if (collectedStars[star.id]) return

      const dist = Math.hypot(x - star.x, y - star.y)
      if (dist <= star.size / 2) {
        setCollectedStars(prev => ({ ...prev, [star.id]: true }))
      }
    })
  }

  // ---------------- RESET ----------------

  function resetAll() {
    setPath([])
    setVisited({})
    setInside({})
    setLastPos(null)
    setLost(false)
    setCollectedStars({})
  }

  // ---------------- GESTURES ----------------

  function handleStart(x: number, y: number) {
    setPath([{ x, y }])
    setVisited({})
    setInside({})
    setLastPos({ x, y })
    setLost(false)
    setCollectedStars({})
    checkStars(x, y)
  }

  function handleMove(x: number, y: number) {
    if (lost) return true

    const newPoint: Vec = { x, y }
    const prev = lastPos
    if (!prev) return false

    const currentPath = [...path]

    for (let i = 0; i + 1 < currentPath.length; i++) {
      if (i === currentPath.length - 2) continue

      const segA = currentPath[i]
      const segB = currentPath[i + 1]

      if (!segmentsIntersectSimple(segA, segB, prev, newPoint)) continue

      const ip = segmentIntersectionPoint(segA, segB, prev, newPoint)

      if (!ip) {
        if (bothSegmentsInsideSameCircle(segA, segB, prev, newPoint, points)) continue
        markLostAndReset()
        return true
      }

      if (pointInsideAnyCircle(ip, points)) continue

      markLostAndReset()
      return true
    }

    setPath(p => [...p, newPoint])

    points.forEach(pt => {
      const dist = Math.hypot(x - pt.x, y - pt.y)
      const isNowInside = dist <= pt.radius + EPS
      const wasInside = inside[pt.id] ?? false

      if (isNowInside && !wasInside) {
        setVisited(v => ({ ...v, [pt.id]: (v[pt.id] ?? 0) + 1 }))
      }

      setInside(prev => ({ ...prev, [pt.id]: isNowInside }))
    })

    setLastPos(newPoint)
    checkStars(x, y)

    return false
  }

  function handleEnd() {
    if (lost) {
      setLost(false)
      return false
    }

    const valid = Validator.validate(points, visited)

    if (!valid) {
      resetAll()
      return false
    }

    return true
  }

  return {
    path,
    visited,
    isPathValid,
    handleStart,
    handleMove,
    handleEnd,
    resetAll,
  }
}
