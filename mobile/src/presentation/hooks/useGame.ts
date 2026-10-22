// src/presentation/hooks/useGame.ts
import { useState, useRef } from "react"
import { Point } from "@/src/core/models/Point"
import { Validator, ValidationResult } from "@/src/core/engine/Validator"
import { LevelRuleConfig } from "@/src/core/rules/LevelRuleConfig"

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
  setCollectedStars: React.Dispatch<React.SetStateAction<Record<string, boolean>>>,
  rules?: LevelRuleConfig[]
) {
  // ---------------- STATE (affichage) ----------------
  const [path, setPath] = useState<Vec[]>([])
  const [visited, setVisited] = useState<Record<string, number>>({})
  const [visitOrder, setVisitOrder] = useState<string[]>([])
  const [starsOrder, setStarsOrder] = useState<string[]>([])
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null)

  // ---------------- REFS (source de vérité synchrone) ----------------
  const pathRef = useRef<Vec[]>([])
  const visitedRef = useRef<Record<string, number>>({})
  const visitOrderRef = useRef<string[]>([])
  const starsOrderRef = useRef<string[]>([])
  const insideRef = useRef<Record<string, boolean>>({})
  const lastPosRef = useRef<Vec | null>(null)
  const lostRef = useRef(false)
  const collectedRef = useRef<Record<string, boolean>>({})

  // Garde la ref des étoiles synchronisée avec le state parent
  // (le parent peut la réinitialiser : retry, niveau suivant...)
  collectedRef.current = collectedStars

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

  // ---------------- RESET ----------------

  function resetAll() {
    pathRef.current = []
    visitedRef.current = {}
    visitOrderRef.current = []
    starsOrderRef.current = []
    insideRef.current = {}
    lastPosRef.current = null
    lostRef.current = false
    collectedRef.current = {}

    setPath([])
    setVisited({})
    setVisitOrder([])
    setStarsOrder([])
    setCollectedStars({})
    setLastResult(null)
  }

  function markLostAndReset() {
    lostRef.current = true
    resetAll()
    // resetAll remet lost à false : on le repositionne pour que les
    // moves suivants soient ignorés jusqu'au prochain handleStart
    lostRef.current = true
  }

  // ---------------- STARS ----------------

  function checkStars(x: number, y: number) {
    // Validité calculée depuis les refs (pas depuis le state périmé)
    const valid = points.every(
      p => (visitedRef.current[p.id] ?? 0) === p.value
    )
    if (!valid) return

    stars.forEach(star => {
      if (collectedRef.current[star.id]) return

      const dist = Math.hypot(x - star.x, y - star.y)
      if (dist <= star.size / 2) {
        collectedRef.current = { ...collectedRef.current, [star.id]: true }
        starsOrderRef.current = [...starsOrderRef.current, star.id]

        setCollectedStars(prev => ({ ...prev, [star.id]: true }))
        setStarsOrder(starsOrderRef.current)
      }
    })
  }

  // ---------------- GESTURES ----------------

  function handleStart(x: number, y: number) {
    // Réinitialisation complète des refs
    pathRef.current = [{ x, y }]
    lostRef.current = false
    collectedRef.current = {}
    starsOrderRef.current = []

    const newInside: Record<string, boolean> = {}
    const newVisited: Record<string, number> = {}
    const newVisitOrder: string[] = []

    points.forEach(pt => {
      const isInside = Math.hypot(x - pt.x, y - pt.y) <= pt.radius + EPS
      newInside[pt.id] = isInside
      if (isInside) {
        newVisited[pt.id] = 1
        newVisitOrder.push(pt.id)
      }
    })

    insideRef.current = newInside
    visitedRef.current = newVisited
    visitOrderRef.current = newVisitOrder
    lastPosRef.current = { x, y }

    // Synchronisation de l'affichage
    setPath(pathRef.current)
    setCollectedStars({})
    setLastResult(null)
    setStarsOrder([])
    setVisited(newVisited)
    setVisitOrder(newVisitOrder)

    checkStars(x, y)
  }

  function handleMove(x: number, y: number) {
    if (lostRef.current) return true

    const prev = lastPosRef.current
    if (!prev) return false

    const newPoint: Vec = { x, y }
    const currentPath = pathRef.current

    // Détection d'auto-intersection
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

    // Mise à jour du tracé
    pathRef.current = [...currentPath, newPoint]
    setPath(pathRef.current)

    // Détection des entrées dans les points (lecture/écriture synchrone)
    let visitedChanged = false
    let orderChanged = false

    points.forEach(pt => {
      const isNowInside = Math.hypot(x - pt.x, y - pt.y) <= pt.radius + EPS
      const wasInside = insideRef.current[pt.id] ?? false

      if (isNowInside && !wasInside) {
        visitedRef.current = {
          ...visitedRef.current,
          [pt.id]: (visitedRef.current[pt.id] ?? 0) + 1,
        }
        visitOrderRef.current = [...visitOrderRef.current, pt.id]
        visitedChanged = true
        orderChanged = true
      }

      insideRef.current[pt.id] = isNowInside
    })

    if (visitedChanged) setVisited(visitedRef.current)
    if (orderChanged) setVisitOrder(visitOrderRef.current)

    lastPosRef.current = newPoint
    checkStars(x, y)

    return false
  }

  function handleEnd(): ValidationResult {
    if (lostRef.current) {
      lostRef.current = false
      const result: ValidationResult = { valid: false, failedRule: "lost" }
      setLastResult(result)
      return result
    }

    const result = Validator.validate(
      points,
      visitedRef.current,
      visitOrderRef.current,
      rules,
      starsOrderRef.current
    )
    setLastResult(result)

    if (!result.valid) {
      resetAll()
    }

    return result
  }

  return {
    path,
    visited,
    visitOrder,
    starsOrder,
    isPathValid,
    lastResult,
    handleStart,
    handleMove,
    handleEnd,
    resetAll,
  }
}