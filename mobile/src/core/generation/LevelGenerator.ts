import { GraphGenerator } from "./GraphGenerator"
import { PathBuilder } from "./PathBuilder"
import { SolverValidator } from "./SolverValidator"
import { ValueAssigner } from "./ValueAssigner"

function generateStars(path: string[]) {
  return path.map((pointId, i) => ({
    id: `star-${i}`,
    pointId,
  }))
}

export const LevelGenerator = {
  generate(options: {
    rows: number
    cols: number
    spacing: number
    pathLength: number
  }) {
    for (let attempt = 0; attempt < 50; attempt++) {
      try {
        // 1️⃣ graph
        const graph = GraphGenerator.generate({
          rows: options.rows,
          cols: options.cols,
          spacing: options.spacing,
          jitter: 10,
        })

        // 2️⃣ solution
        const path = PathBuilder.build(graph, options.pathLength)

        // 3️⃣ validation
        const isValid = SolverValidator.validate(graph, path)

        if (!isValid) continue

        // 4️⃣ assign values
        const points = ValueAssigner.assign(graph.points, path)

        // 5️⃣ stars
        const stars = generateStars(path)

        return {
          id: `level-${Date.now()}`,
          points,
          edges: graph.edges,
          stars,
          solution: path,
        }
      } catch (e) {
        // retry
      }
    }

    throw new Error("LevelGenerator: failed to generate level")
  },
}
