import { World } from "@/src/game/models/World"
import { Level } from "@/src/game/models/Level"
import { LevelLoader } from "../sources/local/json/LevelLoader"

export class LevelRepository {
  private worlds: World[]

  constructor() {
    this.worlds = LevelLoader.loadWorlds()
  }

  getWorlds(): World[] {
    return this.worlds
  }

  getWorld(worldId: string): World | null {
    return this.worlds.find(w => w.id === worldId) ?? null
  }

getLevelsByWorld(worldId: string): Level[] {
  const world = this.getWorld(worldId)
  return world?.levelList ?? []
}

getLevel(worldId: string, levelId: string): Level | null {
  const world = this.getWorld(worldId)
  return world?.levelList.find(l => l.id === levelId) ?? null
}



  getNextLevel(worldId: string, levelId: string): Level | null {
    const levels = this.getLevelsByWorld(worldId)

    const index = levels.findIndex(l => l.id === levelId)
    if (index === -1) return null

    return levels[index + 1] ?? null
  }

  getFirstLevel(worldId: string): Level | null {
    const levels = this.getLevelsByWorld(worldId)
    return levels[0] ?? null
  }
}

export const levelRepository = new LevelRepository()
