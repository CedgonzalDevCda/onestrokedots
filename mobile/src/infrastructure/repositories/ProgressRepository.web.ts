import { PlayerState } from "@/src/meta/progression/PlayerState";

const KEY = "onestroke_progress";

const DEFAULT_STATE: PlayerState = {
  completedLevels: {},
  currency: { gold: 0, bubble: 0 },
  unlockedLevels: {},
};

export const ProgressRepository = {
  async get(): Promise<PlayerState> {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULT_STATE };

      const parsed = JSON.parse(raw);
      return {
        completedLevels: parsed.completedLevels ?? {},
        currency: {
          gold: parsed.currency?.gold ?? 0,
          bubble: parsed.currency?.bubble ?? 0,
        },
        unlockedLevels: parsed.unlockedLevels ?? {},
      };
    } catch {
      return { ...DEFAULT_STATE };
    }
  },

  async save(state: PlayerState): Promise<void> {
    localStorage.setItem(KEY, JSON.stringify(state));
  },

  async reset(): Promise<void> {
    localStorage.removeItem(KEY);
  },
};