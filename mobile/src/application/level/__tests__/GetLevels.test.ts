import { GetLevels } from "../GetLevels"

// ✅ Mock des dépendances (repositories)
jest.mock("@/src/infrastructure/repositories/LevelRepository", () => ({
  levelRepository: {
    getLevelsByWorld: jest.fn(),
  },
}))

jest.mock("@/src/infrastructure/repositories/ProgressRepository", () => ({
  ProgressRepository: {
    get: jest.fn(),
  },
}))

import { levelRepository } from "@/src/infrastructure/repositories/LevelRepository"
import { ProgressRepository } from "@/src/infrastructure/repositories/ProgressRepository"

describe("GetLevels", () => {
  beforeEach(() => {
    // ✅ Reset entre chaque test
    jest.clearAllMocks()
  })

  // =========================
  // ✅ DEFAULT STATE
  // =========================
  it("should return levels with isCompleted = false when no progress", async () => {
    const levels = [
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ]

    const progress = {
      completedLevels: {}, // ✅ aucun niveau complété
    }

    ;(levelRepository.getLevelsByWorld as jest.Mock).mockReturnValue(levels)
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(progress)

    const result = await GetLevels("world")

    // ✅ Tous les niveaux sont non complétés
    expect(result).toEqual([
      { id: "1", name: "Level 1", isCompleted: false },
      { id: "2", name: "Level 2", isCompleted: false },
    ])
  })

  // =========================
  // ✅ COMPLETED LEVEL
  // =========================
  it("should mark a level as completed if it has stars", async () => {
    const levels = [
      { id: "1", name: "Level 1" },
      { id: "2", name: "Level 2" },
    ]

    const progress = {
      completedLevels: {
        "1": 2, // ✅ niveau complété
      },
    }

    ;(levelRepository.getLevelsByWorld as jest.Mock).mockReturnValue(levels)
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(progress)

    const result = await GetLevels("world")

    expect(result).toEqual([
      { id: "1", name: "Level 1", isCompleted: true },
      { id: "2", name: "Level 2", isCompleted: false },
    ])
  })

  // =========================
  // ✅ FALLBACK LOGIC
  // =========================
  it("should treat missing progress as not completed", async () => {
    const levels = [{ id: "1", name: "Level 1" }]

    const progress = {
      completedLevels: {}, // ✅ aucune clé → fallback ?? 0
    }

    ;(levelRepository.getLevelsByWorld as jest.Mock).mockReturnValue(levels)
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(progress)

    const result = await GetLevels("world")

    expect(result[0].isCompleted).toBe(false)
  })

  // =========================
  // ✅ EMPTY LEVEL LIST
  // =========================
  it("should return empty array if no levels exist", async () => {
    const progress = {
      completedLevels: {
        "1": 1,
      },
    }

    ;(levelRepository.getLevelsByWorld as jest.Mock).mockReturnValue([])
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(progress)

    const result = await GetLevels("world")

    // ✅ Pas d'erreur, juste []
    expect(result).toEqual([])
  })

  // =========================
  // ✅ INTEGRATION CALLS
  // =========================
  it("should call repositories with correct parameters", async () => {
    const levels = [{ id: "1", name: "Level 1" }]
    const progress = { completedLevels: {} }

    ;(levelRepository.getLevelsByWorld as jest.Mock).mockReturnValue(levels)
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(progress)

    await GetLevels("world")

    // ✅ Vérifie les appels
    expect(levelRepository.getLevelsByWorld).toHaveBeenCalledWith("world")
    expect(ProgressRepository.get).toHaveBeenCalled()
  })
})
