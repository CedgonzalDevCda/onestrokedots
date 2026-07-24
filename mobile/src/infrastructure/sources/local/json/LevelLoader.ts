import { World } from "@/src/core/models/World"
import { Level } from "@/src/core/models/Level"
import rawWorld from "../../../../data/levels/world1.json"

export const LevelLoader = {
  loadWorlds(): World[] {
    return [
      {
        id: rawWorld.id,
        name: rawWorld.name,
        levelList: rawWorld.levels.map((lvl: any): Level => ({
          id: lvl.id,
          name: lvl.name,

          isCompleted: false,
          isAvailable: true,

          PointList: lvl.points,
          StarList: lvl.stars,

          rules: lvl.rules ?? [],
        })),
      },
    ]
  },
}
