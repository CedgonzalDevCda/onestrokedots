import { useState } from "react"
import { Point } from "@/src/core/models/Point"
import { Validator } from "@/src/core/engine/Validator"

/*
Hook responsible for the core game logic on the React side.

Responsibilities:
- store the finger drawing path
- track visited buttons
- detect when the finger enters a point
- validate the solution using the Validator
*/

export function useGame(points: Point[]) {

  // Finger drawing path
  const [path, setPath] = useState<{ x: number; y: number }[]>([])

  // Number of times each point has been visited
  const [visited, setVisited] = useState<Record<string, number>>({})

  // Track if the finger is currently inside each point
  const [inside, setInside] = useState<Record<string, boolean>>({})

  // Last finger position
  const [lastPos, setLastPos] = useState<{ x: number; y: number } | null>(null)

  /*
  Called when the touch gesture starts
  */
  function handleStart(x: number, y: number) {

    setPath([{ x, y }])
    setVisited({})
    setInside({})
    setLastPos({ x, y })

  }

  /*
  Called when the finger moves
  */
  function handleMove(x: number, y: number) {

    // update visual path
    setPath(p => [...p, { x, y }])

    // detect entry into points
    points.forEach(p => {

      const dx = x - p.x
      const dy = y - p.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      const isInside = distance <= p.radius
      const wasInside = inside[p.id] ?? false

      // ENTER event
      if (isInside && !wasInside) {

        setVisited(v => ({
          ...v,
          [p.id]: (v[p.id] ?? 0) + 1
        }))

      }

      // update inside state
      setInside(prev => ({
        ...prev,
        [p.id]: isInside
      }))

    })

    setLastPos({ x, y })

  }

  /*
  Called when the touch gesture ends
  */
  function handleEnd() {

    console.log("Visited state:", visited)
    console.log("Points:", points)

    const valid = Validator.validate(points, visited)

    console.log("VALID:", valid)

    if (!valid) {
      setPath([])
      setVisited({})
    }

    setLastPos(null)

    return valid
  }

  return {
    path,
    visited,
    handleStart,
    handleMove,
    handleEnd
  }
}
