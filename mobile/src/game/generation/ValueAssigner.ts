import { Point } from "@/src/game/models/Point"

export const ValueAssigner = {
  assign(points: Point[], solution: string[]): Point[] {
    const visitCount: Record<string, number> = {}

    // ✅ compter les visites dans la solution
    solution.forEach(id => {
      visitCount[id] = (visitCount[id] || 0) + 1
    })

    // ✅ assigner aux points
    return points.map(p => ({
      ...p,
      value: visitCount[p.id] || 0,
    }))
  },
}
