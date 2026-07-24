import { ProgressionService } from "../ProgressionService"
import { PlayerState } from "../PlayerState"
import { ProgressRepository } from "@/src/infrastructure/repositories/ProgressRepository"

// ✅ On mock le repository pour éviter toute dépendance externe (storage, API, etc.)
jest.mock("@/src/infrastructure/repositories/ProgressRepository", () => ({
  ProgressRepository: {
    get: jest.fn(),
    save: jest.fn(),
  },
}))

// ✅ Fake repo du domaine (monde + niveaux)
const createMockRepo = () => ({
  getWorldById: jest.fn(),
  getWorlds: jest.fn(),
})

// ✅ Fake état de progression joueur — typé strictement selon PlayerState
// ✅ FIX : ajout de `unlockedLevels` (manquant précédemment, causait un crash
// sur `this.state.unlockedLevels[levelId]` dans isLevelUnlocked())
const createMockState = (): PlayerState => ({
  completedLevels: {}, // id -> nombre d'étoiles
  unlockedLevels: {}, // id -> boolean
  currency: {
    bubble: 100,
    gold: 0,
  },
})

describe("ProgressionService", () => {
  beforeEach(() => {
    // ✅ Reset tous les mocks entre chaque test
    jest.clearAllMocks()
  })

  // =========================
  // ✅ INIT
  // =========================
  it("should load state on init", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ On simule le chargement depuis le repository
    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Vérifie que le state interne est bien chargé
    expect(service.getState()).toBe(state)
  })

  // ✅ Test de régression : garantit que unlockedLevels est toujours présent
  it("should have unlockedLevels defined after init (regression test)", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Garde-fou contre une régression future du mock ou du type PlayerState
    expect(service.getState().unlockedLevels).toBeDefined()
    expect(typeof service.getState().unlockedLevels).toBe("object")
  })

  // =========================
  // ✅ LEVEL UNLOCK
  // =========================

  it("should unlock first level", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ Monde avec 2 niveaux
    repo.getWorldById.mockReturnValue({
      levelList: [{ id: "1" }, { id: "2" }],
    })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Le premier niveau est TOUJOURS débloqué
    expect(service.isLevelUnlocked("world", "1")).toBe(true)
  })

  it("should lock level if previous not completed", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorldById.mockReturnValue({
      levelList: [{ id: "1" }, { id: "2" }],
    })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Niveau 1 non complété → niveau 2 verrouillé
    expect(service.isLevelUnlocked("world", "2")).toBe(false)
  })

  it("should unlock level if previous is completed", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ Niveau 1 complété avec 3 étoiles
    state.completedLevels["1"] = 3

    repo.getWorldById.mockReturnValue({
      levelList: [{ id: "1" }, { id: "2" }],
    })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Niveau 2 devient accessible
    expect(service.isLevelUnlocked("world", "2")).toBe(true)
  })

  it("should treat level as already unlocked if present in unlockedLevels", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ Cas explicite : déblocage manuel via unlockLevel()
    state.unlockedLevels["2"] = true

    repo.getWorldById.mockReturnValue({
      levelList: [{ id: "1" }, { id: "2" }],
    })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Même si le niveau précédent n'est pas complété, unlockedLevels prime
    expect(service.isLevelUnlocked("world", "2")).toBe(true)
  })

  // =========================
  // ✅ COMPLETE LEVEL
  // =========================

  it("should update stars and gold when completing level", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ On termine un niveau avec 3 étoiles
    await service.completeLevel("1", 3)

    // ✅ Vérifie mise à jour progression
    expect(state.completedLevels["1"]).toBe(3)

    // ✅ Vérifie récompense (10 gold par étoile)
    expect(state.currency.gold).toBe(30)

    // ✅ Vérifie sauvegarde appelée
    expect(ProgressRepository.save).toHaveBeenCalled()
  })

  it("should not downgrade stars", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ Déjà complété avec 3 étoiles
    state.completedLevels["1"] = 3

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ❌ On refait avec un score inférieur
    await service.completeLevel("1", 1)

    // ✅ Ne doit PAS écraser les 3 étoiles
    expect(state.completedLevels["1"]).toBe(3)
  })

  // =========================
  // ✅ BUBBLES (monnaie soft)
  // =========================

  it("should add bubbles", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    await service.addBubbles(50)

    // ✅ Ajout correct
    expect(state.currency.bubble).toBe(150)

    // ✅ Sauvegarde appelée
    expect(ProgressRepository.save).toHaveBeenCalled()
  })

  it("should spend bubbles if enough", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    const result = await service.spendBubbles(50)

    // ✅ Achat autorisé
    expect(result).toBe(true)

    // ✅ Décrément correct
    expect(state.currency.bubble).toBe(50)
  })

  it("should not spend bubbles if not enough", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    const result = await service.spendBubbles(200)

    // ❌ Achat refusé
    expect(result).toBe(false)

    // ✅ Rien ne change
    expect(state.currency.bubble).toBe(100)
  })

  // =========================
  // ✅ WORLD UNLOCK
  // =========================

  it("should unlock first world", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorlds.mockReturnValue([
      { id: "w1", levelList: [] },
      { id: "w2", levelList: [] },
    ])

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Le premier monde est toujours accessible
    expect(service.isWorldUnlocked("w1")).toBe(true)
  })

  it("should lock world if previous not completed", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorlds.mockReturnValue([
      { id: "w1", levelList: [{ id: "1" }] },
      { id: "w2", levelList: [] },
    ])

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Monde 1 non terminé → monde 2 verrouillé
    expect(service.isWorldUnlocked("w2")).toBe(false)
  })

  it("should unlock world if previous completed", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ Niveau du monde 1 complété
    state.completedLevels["1"] = 1

    repo.getWorlds.mockReturnValue([
      { id: "w1", levelList: [{ id: "1" }] },
      { id: "w2", levelList: [] },
    ])

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Monde 2 débloqué
    expect(service.isWorldUnlocked("w2")).toBe(true)
  })

  it("should return false for unknown world id", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorlds.mockReturnValue([
      { id: "w1", levelList: [] },
    ])

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Edge case : id inexistant dans la liste des mondes
    expect(service.isWorldUnlocked("unknown")).toBe(false)
  })

  // =========================
  // ✅ COMPLETION %
  // =========================

  it("should return correct world completion", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    // ✅ 1 niveau complété sur 2
    state.completedLevels["1"] = 1

    repo.getWorldById.mockReturnValue({
      levelList: [{ id: "1" }, { id: "2" }],
    })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ 50% de progression
    expect(service.getWorldCompletion("world")).toBe(50)
  })

  it("should return 0 completion for unknown world", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorldById.mockReturnValue(undefined)

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Edge case : monde inexistant → 0%
    expect(service.getWorldCompletion("unknown")).toBe(0)
  })

  it("should return 0 completion for world with no levels", async () => {
    const repo = createMockRepo()
    const state = createMockState()

    repo.getWorldById.mockReturnValue({ levelList: [] })

    ;(ProgressRepository.get as jest.Mock).mockResolvedValue(state)

    const service = new ProgressionService(repo as any)
    await service.init()

    // ✅ Edge case : division par zéro évitée
    expect(service.getWorldCompletion("world")).toBe(0)
  })
})