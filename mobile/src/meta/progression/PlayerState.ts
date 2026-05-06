export type PlayerState = {
  completedLevels: Record<string, number> 
  // levelId -> stars (0 à 3)

  currency: {
    gold: number
    bubble: number
  }
}
