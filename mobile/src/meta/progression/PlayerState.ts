export type PlayerState = {
  completedLevels: Record<string, number>

  currency: {
    gold: number
    bubble: number
  }

  // ✅ unlock manuel
  unlockedLevels: Record<string, boolean>
}
