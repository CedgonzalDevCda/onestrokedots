import { db } from "../sources/local/sqlite/db"
import { PlayerState } from "@/src/game/progression/PlayerState"

const KEY = "main"

type ProgressRow = {
  data: string
}

const DEFAULT_STATE: PlayerState = {
  completedLevels: {},
  currency: {
    gold: 0,
    bubble: 0,
  },
}

export const ProgressRepository = {
  get(): PlayerState {
    const row = db.get<ProgressRow>(
      "SELECT data FROM progress WHERE id = ?",
      [KEY]
    )

    if (!row) {
      return DEFAULT_STATE
    }

    try {
      const parsed = JSON.parse(row.data)

      return {
        completedLevels: parsed.completedLevels ?? {},
        currency: {
          gold: parsed.currency?.gold ?? 0,
          bubble: parsed.currency?.bubble ?? 0,
        },
      }
    } catch {
      return DEFAULT_STATE
    }
  },

  save(state: PlayerState): void {
    db.run(
      "INSERT OR REPLACE INTO progress (id, data) VALUES (?, ?)",
      [KEY, JSON.stringify(state)]
    )
  },

  reset(): void {
    db.run("DELETE FROM progress WHERE id = ?", [KEY])
  },
}
