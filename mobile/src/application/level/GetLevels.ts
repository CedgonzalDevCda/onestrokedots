import { levelRepository } from "@/src/infrastructure/repositories/LevelRepository"
import { ProgressRepository } from "@/src/infrastructure/repositories/ProgressRepository"
import { Level } from "@/src/core/models/Level"

export type LevelWithProgress = Level & {
  isCompleted: boolean
}

export async function GetLevels(worldId: string): Promise<LevelWithProgress[]> {
  const [levels, progress] = await Promise.all([
    Promise.resolve(levelRepository.getLevelsByWorld(worldId)
),
    ProgressRepository.get()
  ])

  return levels.map(level => ({
    ...level,
    isCompleted: (progress.completedLevels[level.id] ?? 0) > 0
  }))
}

