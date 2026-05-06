import { Graph } from "./GraphGenerator"

type Rules = {
  maxVisits?: number
}

function getNeighbors(graph: Graph, id: string): string[] {
  return graph.edges
    .filter(e => e.from === id || e.to === id)
    .map(e => (e.from === id ? e.to : e.from))
}

export const SolverValidator = {
  validate(
    graph: Graph,
    solution: string[],
    rules: Rules = { maxVisits: 1 }
  ): boolean {
    const visitCount: Record<string, number> = {}

    for (let i = 0; i < solution.length; i++) {
      const current = solution[i]
      const prev = solution[i - 1]

      // ✅ check visit count
      visitCount[current] = (visitCount[current] || 0) + 1

      if (visitCount[current] > (rules.maxVisits || 1)) {
        return false
      }

      // ✅ check connectivity
      if (prev) {
        const neighbors = getNeighbors(graph, prev)
        if (!neighbors.includes(current)) {
          return false
        }
      }
    }

    return true
  },
}
