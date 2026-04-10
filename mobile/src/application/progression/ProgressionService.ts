import { PlayerState } from "../../game/progression/PlayerState"
import { LevelRepository, levelRepository } from "@/src/data/repositories/LevelRepository"

export class ProgressionService {
  constructor(
    private state: PlayerState,
    private repo: LevelRepository
  ) {}

  // ✅ LEVEL UNLOCK
  isLevelUnlocked(worldId: string, levelId: string): boolean {
    const world = this.repo.getWorld(worldId)
    if (!world) return false

    const index = world.levelList.findIndex(l => l.id === levelId)

    // sécurité si level introuvable
    if (index === -1) return false

    // premier level toujours unlock
    if (index === 0) return true

    const previousLevel = world.levelList[index - 1]
    return this.isLevelCompleted(previousLevel.id)
  }

  // ✅ LEVEL COMPLETED
  isLevelCompleted(levelId: string): boolean {
    return this.state.completedLevels[levelId] !== undefined
  }

  // ✅ STARS
  getStars(levelId: string): number {
    return this.state.completedLevels[levelId] ?? 0
  }

    // ✅ BUBBLES

  getBubbles(): number {
    return this.state.currency.bubble
  }

  addBubbles(amount: number) {
    this.state.currency.bubble += amount
  }

  spendBubbles(amount: number): boolean {
    if (this.state.currency.bubble < amount) return false

    this.state.currency.bubble -= amount
    return true
  }


  // ✅ COMPLETE LEVEL
  completeLevel(levelId: string, stars: number) {
    const currentStars = this.getStars(levelId)

    // garder le meilleur score
    if (stars > currentStars) {
      this.state.completedLevels[levelId] = stars
    }

    // reward simple
    this.state.currency.gold += stars * 10
  }

  // ✅ WORLD UNLOCK
  isWorldUnlocked(worldId: string): boolean {
    const worlds = this.repo.getWorlds()
    const index = worlds.findIndex(w => w.id === worldId)

    if (index === -1) return false

    // premier world toujours unlock
    if (index === 0) return true

    const previousWorld = worlds[index - 1]

    return previousWorld.levelList.every(level =>
      this.isLevelCompleted(level.id)
    )
  }

  // ✅ COMPLETION %
  getWorldCompletion(worldId: string): number {
    const world = this.repo.getWorld(worldId)
    if (!world) return 0

    const total = world.levelList.length
    if (total === 0) return 0

    const completed = world.levelList.filter(l =>
      this.isLevelCompleted(l.id)
    ).length

    return Math.floor((completed / total) * 100)
  }

  // ✅ GET STATE (pour save)
  getState(): PlayerState {
    return this.state
  }
}

//
// ✅ ✅ INSTANCE GLOBALE (FIX PRINCIPAL)
//

const defaultState: PlayerState = {
  completedLevels: {},
  currency: {
    gold: 0,
    bubble: 0
  }
}

export const progression = new ProgressionService(
  defaultState,
  levelRepository
)