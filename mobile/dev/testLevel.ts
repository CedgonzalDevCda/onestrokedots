import { LevelGenerator } from "@/src/core/generation/LevelGenerator"

const level = LevelGenerator.generate({
  rows: 4,
  cols: 4,
  spacing: 100,
  pathLength: 8,
})

console.log("LEVEL:", level)
