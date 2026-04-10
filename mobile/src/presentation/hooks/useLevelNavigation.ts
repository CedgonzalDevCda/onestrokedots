import { levelRepository } from "@/src/data/repositories/LevelRepository"

export function useLevelNavigation() {
  function getLevel(worldId: string, levelId: string) {
    return levelRepository.getLevel(worldId, levelId)
  }

  function getNextLevel(worldId: string, levelId: string) {
    return levelRepository.getNextLevel(worldId, levelId)
  }

  return {
    getLevel,
    getNextLevel,
  }
}
