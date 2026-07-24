import { Graph } from "./GraphGenerator"

function getNeighbors(graph: Graph, id: string): string[] {
  return graph.edges
    .filter(e => e.from === id || e.to === id)
    .map(e => (e.from === id ? e.to : e.from))
}

function tryBuild(graph: Graph, targetLength: number): string[] {
  const start =
    graph.points[Math.floor(Math.random() * graph.points.length)].id

  const path: string[] = [start]
  const visited = new Set<string>([start])

  while (path.length < targetLength) {
    const current = path[path.length - 1]

    const neighbors = getNeighbors(graph, current)

    const candidates = neighbors.filter(n => !visited.has(n))

    if (candidates.length === 0) break

    const next =
      candidates[Math.floor(Math.random() * candidates.length)]

    path.push(next)
    visited.add(next)
  }

  return path
}

export const PathBuilder = {
  build(graph: Graph, targetLength: number): string[] {
    for (let i = 0; i < 100; i++) {
      const path = tryBuild(graph, targetLength)
      if (path.length === targetLength) return path
    }

    throw new Error("PathBuilder: failed to build valid path")
  },
}
