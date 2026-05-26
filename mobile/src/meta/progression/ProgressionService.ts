import { PlayerState } from "./PlayerState"
import { LevelRepository } from "@/src/infrastructure/repositories/LevelRepository"
import { ProgressRepository } from "@/src/infrastructure/repositories/ProgressRepository"

export class ProgressionService {
  private state: PlayerState | null = null

  constructor(private repo: LevelRepository) {}

  async init() {
    this.state = await ProgressRepository.get()
  }

  private ensureState() {
    if (!this.state) {
      throw new Error("ProgressionService not initialized")
    }
  }

  // ✅ GOLD
  getGold(): number {
    this.ensureState()
    return this.state!.currency.gold
  }

  async spendGold(amount: number): Promise<boolean> {
    this.ensureState()

    if (this.state!.currency.gold < amount) return false

    this.state!.currency.gold -= amount
    await ProgressRepository.save(this.state!)

    return true
  }

  // ✅ UNLOCK MANUEL
  async unlockLevel(worldId: string, levelId: string): Promise<boolean> {
    this.ensureState()

    const cost = 50

    const success = await this.spendGold(cost)
    if (!success) return false

    this.state!.unlockedLevels[levelId] = true

    await ProgressRepository.save(this.state!)

    return true
  }

  // ✅ LEVEL UNLOCK
  isLevelUnlocked(worldId: string, levelId: string): boolean {
    this.ensureState()

    // ✅ unlock manuel prioritaire
    if (this.state!.unlockedLevels[levelId]) return true

    const world = this.repo.getWorldById(worldId)

    if (!world) return false

    const index = world.levelList.findIndex(l => l.id === levelId)
    if (index === -1) return false
    if (index === 0) return true

    const previousLevel = world.levelList[index - 1]
    return this.isLevelCompleted(previousLevel.id)
  }

  // ✅ LEVEL COMPLETED
  isLevelCompleted(levelId: string): boolean {
    this.ensureState()
    return this.state!.completedLevels[levelId] !== undefined
  }

  // ✅ STARS
  getStars(levelId: string): number {
    this.ensureState()
    return this.state!.completedLevels[levelId] ?? 0
  }

  // ✅ BUBBLES
  getBubbles(): number {
    this.ensureState()
    return this.state!.currency.bubble
  }

  async addBubbles(amount: number) {
    this.ensureState()
    this.state!.currency.bubble += amount
    await ProgressRepository.save(this.state!)
  }

  async spendBubbles(amount: number): Promise<boolean> {
    this.ensureState()

    if (this.state!.currency.bubble < amount) return false

    this.state!.currency.bubble -= amount
    await ProgressRepository.save(this.state!)

    return true
  }

  // ✅ COMPLETE LEVEL (FIX ICI)
  async completeLevel(levelId: string, stars: number) {
    this.ensureState()

    const currentStars = this.state!.completedLevels[levelId] ?? 0

    if (stars > currentStars) {
      this.state!.completedLevels[levelId] = stars
    }

    this.state!.currency.gold += stars * 10

    // ✅ PERSISTENCE
    await ProgressRepository.save(this.state!)
  }

  // ✅ WORLD UNLOCK
  isWorldUnlocked(worldId: string): boolean {
    this.ensureState()

    const worlds = this.repo.getWorlds()
    const index = worlds.findIndex(w => w.id === worldId)

    if (index === -1) return false
    if (index === 0) return true

    const previousWorld = worlds[index - 1]

    return previousWorld.levelList.every(level =>
      this.isLevelCompleted(level.id)
    )
  }

  // ✅ COMPLETION %
  getWorldCompletion(worldId: string): number {
    this.ensureState()

    const world = this.repo.getWorldById(worldId)
    if (!world) return 0

    const total = world.levelList.length
    if (total === 0) return 0

    const completed = world.levelList.filter(l =>
      this.isLevelCompleted(l.id)
    ).length

    return Math.floor((completed / total) * 100)
  }

  getState(): PlayerState {
    this.ensureState()
    return this.state!
  }
}

// ✅ INSTANCE GLOBALE PROPRE
import { levelRepository } from "@/src/infrastructure/repositories/LevelRepository"

export const progression = new ProgressionService(levelRepository)
