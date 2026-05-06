import { db } from "../persistence/sqlite/db";
import { PlayerState } from "@/src/meta/progression/PlayerState";

const KEY = "main";

type ProgressRow = {
  data: string;
};

const DEFAULT_STATE: PlayerState = {
  completedLevels: {},
  currency: {
    gold: 0,
    bubble: 0,
  },
};

export const ProgressRepository = {
  async get(): Promise<PlayerState> {
    const row = await db.get<ProgressRow>(
      "SELECT data FROM progress WHERE id = ?",
      [KEY]
    );

    if (!row) {
      await db.run(
        "INSERT INTO progress (id, data) VALUES (?, ?)",
        [KEY, JSON.stringify(DEFAULT_STATE)]
      );

      return DEFAULT_STATE;
    }

    try {
      const parsed = JSON.parse(row.data);

      return {
        completedLevels: parsed.completedLevels ?? {},
        currency: {
          gold: parsed.currency?.gold ?? 0,
          bubble: parsed.currency?.bubble ?? 0,
        },
      };
    } catch {
      // fallback sécurisé si JSON corrompu
      await db.run(
        "UPDATE progress SET data = ? WHERE id = ?",
        [JSON.stringify(DEFAULT_STATE), KEY]
      );

      return DEFAULT_STATE;
    }
  },

  async save(state: PlayerState): Promise<void> {
    await db.run(
      "INSERT OR REPLACE INTO progress (id, data) VALUES (?, ?)",
      [KEY, JSON.stringify(state)]
    );
  },

  async reset(): Promise<void> {
    await db.run("DELETE FROM progress WHERE id = ?", [KEY]);
  },
};
