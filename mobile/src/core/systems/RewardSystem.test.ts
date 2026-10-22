// src/core/systems/RewardSystem.test.ts
import { calculateLevelReward, REWARD_CONFIG } from "./RewardSystem"
import { Level } from "@/src/core/models/Level"

// Petit helper pour construire un Level minimal dans les tests,
// sans avoir à répéter tous les champs à chaque fois.
function makeLevel(overrides: Partial<Level> = {}): Level {
  return {
    id: "test-level",
    name: "Test Level",
    isCompleted: false,
    isAvailable: true,
    rules: [],
    PointList: [],
    StarList: [],
    ...overrides,
  }
}

describe("calculateLevelReward", () => {
  it("retourne 0 or si starsEarned vaut 0", () => {
    const level = makeLevel()
    const reward = calculateLevelReward(level, 0)

    expect(reward.gold).toBe(0)
  })

  it("applique le gain de base sans bonus pour un niveau sans points ni règles", () => {
    const level = makeLevel({ PointList: [], rules: [] })
    const reward = calculateLevelReward(level, 3)

    // multiplier = 1 (aucun bonus)
    // gold = 3 * 10 * 1 = 30
    expect(reward.gold).toBe(3 * REWARD_CONFIG.baseGoldPerStar)
  })

  it("augmente le gain en fonction du nombre de points du niveau", () => {
    const level = makeLevel({
      PointList: [
        { id: "1", x: 0, y: 0, value: 0, radius: 32 },
        { id: "2", x: 0, y: 0, value: 0, radius: 32 },
        { id: "3", x: 0, y: 0, value: 0, radius: 32 },
      ],
    })
    const reward = calculateLevelReward(level, 2)

    // multiplier = 1 + 3 * 0.08 = 1.24
    // gold = 2 * 10 * 1.24 = 24.8 -> arrondi à 25
    const expectedMultiplier = 1 + 3 * REWARD_CONFIG.pointsWeight
    const expectedGold = Math.round(2 * REWARD_CONFIG.baseGoldPerStar * expectedMultiplier)

    expect(reward.gold).toBe(expectedGold)
  })

  it("augmente le gain en fonction de la somme des valeurs des points", () => {
    const level = makeLevel({
      PointList: [
        { id: "1", x: 0, y: 0, value: 5, radius: 32 },
        { id: "2", x: 0, y: 0, value: 3, radius: 32 },
      ],
    })
    const reward = calculateLevelReward(level, 1)

    // pointsCount = 2, totalValue = 8
    const expectedMultiplier =
      1 + 2 * REWARD_CONFIG.pointsWeight + 8 * REWARD_CONFIG.valueWeight
    const expectedGold = Math.round(1 * REWARD_CONFIG.baseGoldPerStar * expectedMultiplier)

    expect(reward.gold).toBe(expectedGold)
  })

  it("ajoute un bonus si le niveau contient une règle 'ordered-stars'", () => {
    const level = makeLevel({
      PointList: [],
      rules: [{ type: "ordered-stars", params: {} } as any],
    })
    const reward = calculateLevelReward(level, 3)

    // multiplier = 1 + 0.4 = 1.4
    const expectedMultiplier = 1 + REWARD_CONFIG.orderedStarsBonus
    const expectedGold = Math.round(3 * REWARD_CONFIG.baseGoldPerStar * expectedMultiplier)

    expect(reward.gold).toBe(expectedGold)
  })

  it("n'ajoute pas le bonus 'ordered-stars' si la règle est absente", () => {
    const level = makeLevel({
      rules: [{ type: "start-point", params: { pointId: "1" } } as any],
    })
    const reward = calculateLevelReward(level, 3)

    const expectedGold = 3 * REWARD_CONFIG.baseGoldPerStar // multiplier = 1
    expect(reward.gold).toBe(expectedGold)
  })

  it("plafonne le multiplicateur à maxMultiplier même sur un niveau très difficile", () => {
    const manyPoints = Array.from({ length: 100 }, (_, i) => ({
      id: `p${i}`,
      x: 0,
      y: 0,
      value: 50,
      radius: 32,
    }))

    const level = makeLevel({
      PointList: manyPoints,
      rules: [{ type: "ordered-stars", params: {} } as any],
    })
    const reward = calculateLevelReward(level, 3)

    // Le multiplicateur théorique serait énorme, mais doit être capé à maxMultiplier (3)
    const expectedGold = Math.round(3 * REWARD_CONFIG.baseGoldPerStar * REWARD_CONFIG.maxMultiplier)

    expect(reward.gold).toBe(expectedGold)
  })

  it("gère un niveau sans PointList ni rules définis (undefined)", () => {
    const level = makeLevel({ PointList: undefined as any, rules: undefined })
    const reward = calculateLevelReward(level, 2)

    // Doit se comporter comme des tableaux vides (grâce aux ?? [])
    expect(reward.gold).toBe(2 * REWARD_CONFIG.baseGoldPerStar)
  })

  it("arrondit correctement le résultat final (Math.round)", () => {
    const level = makeLevel({
      PointList: [{ id: "1", x: 0, y: 0, value: 1, radius: 32 }],
    })
    const reward = calculateLevelReward(level, 1)

    // Vérifie juste que le résultat est bien un entier
    expect(Number.isInteger(reward.gold)).toBe(true)
  })
})