import { useState } from "react"
import { Point } from "@/src/core/models/Point"
import { Validator } from "@/src/core/engine/Validator"

/*
useGame hook — refactorisé pour plus de lisibilité.

Règles:
- une seule ligne trace le chemin (path)
- croisement interdit sauf si l'intersection se situe à l'intérieur d'un point (cercle)
- visited compte le nombre d'entrées dans chaque point
*/

type Vec = { x: number; y: number }
type Circles = Point[]

export function useGame(points: Point[]) {
  // --- état du hook ---
  const [path, setPath] = useState<Vec[]>([])
  const [visited, setVisited] = useState<Record<string, number>>({})
  const [inside, setInside] = useState<Record<string, boolean>>({})
  const [lastPos, setLastPos] = useState<Vec | null>(null)
  const [lost, setLost] = useState(false)

  // --- constantes / tolérances ---
  const EPS = 1e-6

  // --- Helpers géométriques ---
  function orientation(a: Vec, b: Vec, c: Vec): 0 | 1 | 2 {
    // valeur signée ; arrondie à zéro si très petite
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
    // test d'intersection robuste basé sur orientations
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
    // Retourne le point d'intersection unique si existant,
    // ou un point approché pour recouvrement colinéaire, sinon null.
    const A1 = b.y - a.y
    const B1 = a.x - b.x
    const C1 = A1 * a.x + B1 * a.y

    const A2 = d.y - c.y
    const B2 = c.x - d.x
    const C2 = A2 * c.x + B2 * c.y

    const det = A1 * B2 - A2 * B1
    if (Math.abs(det) < EPS) {
      // lignes parallèles ou colinéaires
      const colinear = orientation(a, b, c) === 0 && orientation(a, b, d) === 0
      if (!colinear) return null

      // trouver zone de recouvrement (en x puis y) et renvoyer centre de la boite si overlap
      const minAx = Math.min(a.x, b.x), maxAx = Math.max(a.x, b.x)
      const minBx = Math.min(c.x, d.x), maxBx = Math.max(c.x, d.x)
      const overlapMinX = Math.max(minAx, minBx), overlapMaxX = Math.min(maxAx, maxBx)

      const minAy = Math.min(a.y, b.y), maxAy = Math.max(a.y, b.y)
      const minBy = Math.min(c.y, d.y), maxBy = Math.max(c.y, d.y)
      const overlapMinY = Math.max(minAy, minBy), overlapMaxY = Math.min(maxAy, maxBy)

      if (overlapMinX <= overlapMaxX + EPS && overlapMinY <= overlapMaxY + EPS) {
        return { x: (overlapMinX + overlapMaxX) / 2, y: (overlapMinY + overlapMaxY) / 2 }
      }
      return null
    }

    const x = (B2 * C1 - B1 * C2) / det
    const y = (A1 * C2 - A2 * C1) / det

    // vérifier que (x,y) appartient aux deux segments
    const within = (u: Vec, v: Vec) =>
      x >= Math.min(u.x, v.x) - EPS &&
      x <= Math.max(u.x, v.x) + EPS &&
      y >= Math.min(u.y, v.y) - EPS &&
      y <= Math.max(u.y, v.y) + EPS

    if (within(a, b) && within(c, d)) return { x, y }
    return null
  }

  function pointInsideAnyCircle(p: Vec, circles: Circles): boolean {
    for (const c of circles) {
      const dx = p.x - c.x
      const dy = p.y - c.y
      if (Math.hypot(dx, dy) <= c.radius + EPS) return true
    }
    return false
  }

  // vérifie si deux segments sont complètement contenus dans le même cercle
  function bothSegmentsInsideSameCircle(s1a: Vec, s1b: Vec, s2a: Vec, s2b: Vec, circles: Circles) {
    for (const c of circles) {
      const d1 = Math.hypot((s1a.x + s1b.x) / 2 - c.x, (s1a.y + s1b.y) / 2 - c.y)
      const d2 = Math.hypot((s2a.x + s2b.x) / 2 - c.x, (s2a.y + s2b.y) / 2 - c.y)
      // heuristique : si les deux milieux sont dans le cercle, on considère les segments "dans" le cercle
      if (d1 <= c.radius + EPS && d2 <= c.radius + EPS) return true
    }
    return false
  }

  // --- gestion d'état commonisée ---
  function markLostAndReset() {
    setLost(true)
    setPath([])
    setVisited({})
    setInside({})
    setLastPos(null)
  }

  // --- évènements de geste ---
  function handleStart(x: number, y: number) {
    setPath([{ x, y }])
    setVisited({})
    setInside({})
    setLastPos({ x, y })
    setLost(false)
  }

  function handleMove(x: number, y: number): boolean {
    if (lost) return true

    const newPoint: Vec = { x, y }
    const prev = lastPos
    if (!prev) {
      setLastPos(newPoint)
      setPath([newPoint])
      return false
    }

    const newSegA = prev
    const newSegB = newPoint
    const currentPath = [...path] // snapshot

    // itérer sur chaque segment existant (i -> i+1), en ignorant le segment adjacent
    for (let i = 0; i + 1 < currentPath.length; i++) {
      if (i === currentPath.length - 2) continue // segment adjacent à prev

      const segA = currentPath[i]
      const segB = currentPath[i + 1]

      if (!segmentsIntersectSimple(segA, segB, newSegA, newSegB)) continue

      const ip = segmentIntersectionPoint(segA, segB, newSegA, newSegB)

      if (!ip) {
        // cas extrême (parallèle/colinéaire sans point d'intersection unique)
        // fallback conservateur : autoriser si les deux segments sont "dans" le même cercle
        if (bothSegmentsInsideSameCircle(segA, segB, newSegA, newSegB, points)) {
          continue
        }
        markLostAndReset()
        return true
      }

      // si le point d'intersection est à l'intérieur d'un cercle : autorisé
      if (pointInsideAnyCircle(ip, points)) {
        continue
      }

      // sinon, collision interdite
      markLostAndReset()
      return true
    }

    // pas de collision : on prolonge le path et on gère l'entrée dans les points
    setPath(p => [...p, newPoint])

    points.forEach(pt => {
      const dx = x - pt.x
      const dy = y - pt.y
      const dist = Math.hypot(dx, dy)
      const isNowInside = dist <= pt.radius + EPS
      const wasInside = inside[pt.id] ?? false

      if (isNowInside && !wasInside) {
        setVisited(v => ({ ...v, [pt.id]: (v[pt.id] ?? 0) + 1 }))
      }

      // mettre à jour l'état inside pour ce point
      setInside(prev => ({ ...prev, [pt.id]: isNowInside }))
    })

    setLastPos(newPoint)
    return false
  }

  function handleEnd() {
    if (lost) {
      // on remet lost à false pour que le consommateur puisse afficher l'état brièvement s'il le souhaite
      setLost(false)
      return false
    }

    const valid = Validator.validate(points, visited)
    if (!valid) {
      // reset visuel si échec de validation
      setPath([])
      setVisited({})
    }

    setLastPos(null)
    return valid
  }

  function reset() {
    setPath([])
    setVisited({})
    setInside({})
    setLastPos(null)
    setLost(false)
  }

  return {
    path,
    visited,
    handleStart,
    handleMove,
    handleEnd,
    lost,
    reset
  }
}
