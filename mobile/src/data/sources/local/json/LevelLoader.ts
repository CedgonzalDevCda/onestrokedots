import { World } from "@/src/game/models/World"
import { Level } from "@/src/game/models/Level"
import rawWorld from "../../../levels/world1.json"

export const LevelLoader = {
  loadWorlds(): World[] {
    return [
      {
        id: rawWorld.id,
        name: rawWorld.name,
        levelList: rawWorld.levels.map((lvl: any): Level => ({
          id: lvl.id,
          name: lvl.name,

          // ✅ champs ajoutés
          isCompleted: false,
          isAvailable: true,

          // ✅ mapping noms
          PointList: lvl.points,
          StarList: lvl.stars,
        })),
      },
    ]
  },
}
