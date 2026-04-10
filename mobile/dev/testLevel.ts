import { LevelGenerator } from "@/src/game/generation/LevelGenerator"

const level = LevelGenerator.generate({
  rows: 4,
  cols: 4,
  spacing: 100,
  pathLength: 8,
})

console.log("LEVEL:", level)
