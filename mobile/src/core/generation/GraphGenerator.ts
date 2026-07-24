import { Point } from "@/src/core/models/Point"

export type Edge = {
  from: string
  to: string
}

export type Graph = {
  points: Point[]
  edges: Edge[]
}

type Options = {
  rows: number
  cols: number
  spacing: number
  jitter?: number
}

export const GraphGenerator = {
  generate(options: Options): Graph {
    const { rows, cols, spacing, jitter = 0 } = options

    const points: Point[] = []
    const edges: Edge[] = []

    let id = 0

    const index = (row: number, col: number) => row * cols + col

    // ✅ generate points
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * spacing + (Math.random() - 0.5) * jitter
        const y = row * spacing + (Math.random() - 0.5) * jitter

        points.push({
          id: String(id++),
          x,
          y,
          value: 0,
          radius: 20,
        })
      }
    }

    // ✅ generate edges (grid neighbors)
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const current = index(row, col)

        if (col < cols - 1) {
          edges.push({
            from: String(current),
            to: String(index(row, col + 1)),
          })
        }

        if (row < rows - 1) {
          edges.push({
            from: String(current),
            to: String(index(row + 1, col)),
          })
        }
      }
    }

    return { points, edges }
  },
}
