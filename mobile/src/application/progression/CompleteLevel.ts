import { ProgressRepository } from "@/src/data/repositories/ProgressRepository"
import { PlayerState } from "@/src/game/progression/PlayerState"

export async function completeLevel(
  levelId: string,
  stars: number
): Promise<PlayerState> {
  const state = await ProgressRepository.get()

  const currentStars = state.completedLevels[levelId] ?? 0

  // ✅ on garde le meilleur score
  if (stars > currentStars) {
    state.completedLevels[levelId] = stars

    // 💰 reward (exemple)
    state.currency.gold += stars * 10
  }

  await ProgressRepository.save(state)

  return state
}
