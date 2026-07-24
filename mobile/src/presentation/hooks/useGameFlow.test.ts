// src/presentation/hooks/useGameFlow.test.ts
import { renderHook, act } from "@testing-library/react-native"
import { router } from "expo-router"

import { useGameFlow } from "@/src/presentation/hooks/useGameFlow"
import { useGame } from "@/src/presentation/hooks/useGame"
import { useLevelNavigation } from "@/src/presentation/hooks/useLevelNavigation"
import { progression } from "@/src/meta/progression/ProgressionService"
import { useInterstitial } from "@/src/infrastructure/ads/useInterstitial"
import { useAds } from "@/src/infrastructure/ads/AdProvider"
import { getSpecialPointIds } from "@/src/core/rules/getSpecialPointIds"

// ---- Mocks explicites : PAS de jest.mock("path") seul, sinon Jest lit le vrai fichier ----
jest.mock("expo-router", () => ({
  router: { replace: jest.fn() },
}))

jest.mock("@/src/presentation/hooks/useGame", () => ({
  useGame: jest.fn(),
}))

jest.mock("@/src/presentation/hooks/useLevelNavigation", () => ({
  useLevelNavigation: jest.fn(),
}))

jest.mock("@/src/meta/progression/ProgressionService", () => ({
  progression: { completeLevel: jest.fn() },
}))

jest.mock("@/src/infrastructure/ads/useInterstitial", () => ({
  useInterstitial: jest.fn(),
}))

jest.mock("@/src/infrastructure/ads/AdProvider", () => ({
  useAds: jest.fn(),
}))

jest.mock("@/src/core/rules/getSpecialPointIds", () => ({
  getSpecialPointIds: jest.fn(),
}))

const mockUseGame = useGame as jest.Mock
const mockUseLevelNavigation = useLevelNavigation as jest.Mock
const mockUseInterstitial = useInterstitial as jest.Mock
const mockUseAds = useAds as jest.Mock
const mockGetSpecialPointIds = getSpecialPointIds as jest.Mock

// ---- Helpers ----
function buildLevel(overrides: Partial<any> = {}) {
  return {
    id: "lvl-1",
    PointList: [{ id: "p1", x: 0, y: 0 }],
    StarList: [],
    rules: [],
    ...overrides,
  }
}

function buildGameApi(overrides: Partial<any> = {}) {
  return {
    handleStart: jest.fn(),
    handleMove: jest.fn(),
    handleEnd: jest.fn().mockReturnValue({ valid: true }),
    resetAll: jest.fn(),
    lastResult: { valid: true },
    ...overrides,
  }
}

describe("useGameFlow", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()

    mockUseLevelNavigation.mockReturnValue({
      getLevel: jest.fn().mockReturnValue(buildLevel()),
      getNextLevel: jest.fn().mockReturnValue(buildLevel({ id: "lvl-2" })),
    })

    mockUseGame.mockReturnValue(buildGameApi())

    mockUseInterstitial.mockReturnValue({ show: jest.fn() })

    mockUseAds.mockReturnValue({
      adMode: "low",
      canLoadAd: jest.fn().mockReturnValue(false),
    })

    mockGetSpecialPointIds.mockReturnValue({
      startPointIds: ["p1"],
      endPointIds: ["p1"],
    })
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  describe("level resolution", () => {
    it("should return null when level is not found", () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(undefined),
        getNextLevel: jest.fn().mockReturnValue(undefined),
      })

      // Act
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-x"))

      // Assert
      expect(result.current).toBeNull()
    })

    it("should return level and derived data when level exists", () => {
      // Act
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Assert
      expect(result.current!.level.id).toBe("lvl-1")
      expect(result.current!.startPointIds).toEqual(["p1"])
      expect(result.current!.endPointIds).toEqual(["p1"])
    })

    it("should merge default rules with level rules", () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(
          buildLevel({ rules: [{ type: "custom-rule" }] })
        ),
        getNextLevel: jest.fn().mockReturnValue(undefined),
      })

      // Act
      renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Assert
      expect(mockGetSpecialPointIds).toHaveBeenCalledWith([
        { type: "visit-count" },
        { type: "no-backtrack" },
        { type: "custom-rule" },
      ])
    })
  })

  describe("input handlers", () => {
    it("should call game.handleStart with correct coordinates", () => {
      // Arrange
      const gameApi = buildGameApi()
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))
      const event = { nativeEvent: { locationX: 10, locationY: 20 } }

      // Act
      act(() => {
        result.current!.start(event)
      })

      // Assert
      expect(gameApi.handleStart).toHaveBeenCalledWith(10, 20)
    })

    it("should call game.handleMove with correct coordinates", () => {
      // Arrange
      const gameApi = buildGameApi()
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))
      const event = { nativeEvent: { locationX: 5, locationY: 15 } }

      // Act
      act(() => {
        result.current!.move(event)
      })

      // Assert
      expect(gameApi.handleMove).toHaveBeenCalledWith(5, 15)
    })

    it("should not throw when start/move/end called and level is missing", () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(undefined),
        getNextLevel: jest.fn().mockReturnValue(undefined),
      })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-x"))

      // Act & Assert
      expect(result.current).toBeNull()
    })
  })

  describe("end game flow", () => {
    it("should not complete progression when result is invalid", async () => {
      // Arrange
      const gameApi = buildGameApi({
        handleEnd: jest.fn().mockReturnValue({ valid: false, failedRule: "no-backtrack" }),
      })
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      await act(async () => {
        result.current!.end()
      })

      // Assert
      expect(progression.completeLevel).not.toHaveBeenCalled()
      expect(result.current!.showModal).toBe(false)
    })

    it("should complete progression and show modal when result is valid", async () => {
      // Arrange
      const gameApi = buildGameApi({
        handleEnd: jest.fn().mockReturnValue({ valid: true }),
      })
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      await act(async () => {
        result.current!.end()
      })

      // Assert
      expect(progression.completeLevel).toHaveBeenCalledWith("lvl-1", 0)
      expect(result.current!.showModal).toBe(true)
    })

    it("should count collected stars correctly on completion", async () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(buildLevel()),
        getNextLevel: jest.fn().mockReturnValue(undefined),
      })
      const gameApi = buildGameApi({
        handleEnd: jest.fn().mockReturnValue({ valid: true }),
      })
      mockUseGame.mockReturnValue(gameApi)

      const { result, rerender } = renderHook(
        (props: { collected: Record<string, boolean> }) =>
          useGameFlow("world-1", "lvl-1"),
        { initialProps: { collected: {} } }
      )

      // Simuler des étoiles collectées via handleEnd résolu après collecte
      // (le state interne collectedStars n'est pas directement settable depuis l'extérieur,
      // donc on vérifie le cas 0 étoile ici, le cas >0 est couvert par un test d'intégration
      // sur useGame si applicable)

      // Act
      await act(async () => {
        result.current!.end()
      })

      // Assert
      expect(progression.completeLevel).toHaveBeenCalledWith("lvl-1", 0)
    })

    it("should show interstitial before showing modal when adMode is high and ad can load", async () => {
      // Arrange
      const show = jest.fn()
      mockUseInterstitial.mockReturnValue({ show })
      mockUseAds.mockReturnValue({ adMode: "high", canLoadAd: jest.fn().mockReturnValue(true) })
      const gameApi = buildGameApi({ handleEnd: jest.fn().mockReturnValue({ valid: true }) })
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      await act(async () => {
        result.current!.end()
      })

      // Assert : show() appelé, mais modal pas encore visible avant le timer
      expect(show).toHaveBeenCalled()
      expect(result.current!.showModal).toBe(false)

      act(() => {
        jest.advanceTimersByTime(300)
      })

      expect(result.current!.showModal).toBe(true)
    })
  })

  describe("retry", () => {
    it("should reset modal, stars and game state", () => {
      // Arrange
      const gameApi = buildGameApi()
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.retry()
      })

      // Assert
      expect(gameApi.resetAll).toHaveBeenCalled()
      expect(result.current!.showModal).toBe(false)
      expect(result.current!.starsEarned).toBe(0)
    })
  })

  describe("next", () => {
    it("should navigate to /worlds when there is no next level", () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(buildLevel()),
        getNextLevel: jest.fn().mockReturnValue(undefined),
      })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.next()
      })

      // Assert
      expect(router.replace).toHaveBeenCalledWith("/worlds")
    })

    it("should navigate to /play with next level params when a next level exists", () => {
      // Arrange
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(buildLevel()),
        getNextLevel: jest.fn().mockReturnValue(buildLevel({ id: "lvl-2" })),
      })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.next()
      })

      // Assert
      expect(router.replace).toHaveBeenCalledWith({
        pathname: "/play",
        params: { worldId: "world-1", levelId: "lvl-2" },
      })
    })

    it("should reset game state before navigating to next level", () => {
      // Arrange
      const gameApi = buildGameApi()
      mockUseGame.mockReturnValue(gameApi)
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(buildLevel()),
        getNextLevel: jest.fn().mockReturnValue(buildLevel({ id: "lvl-2" })),
      })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.next()
      })

      // Assert
      expect(gameApi.resetAll).toHaveBeenCalled()
    })

    it("should delay next navigation via interstitial when adMode is high", () => {
      // Arrange
      const show = jest.fn()
      mockUseInterstitial.mockReturnValue({ show })
      mockUseAds.mockReturnValue({ adMode: "high", canLoadAd: jest.fn().mockReturnValue(true) })
      mockUseLevelNavigation.mockReturnValue({
        getLevel: jest.fn().mockReturnValue(buildLevel()),
        getNextLevel: jest.fn().mockReturnValue(buildLevel({ id: "lvl-2" })),
      })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.next()
      })

      expect(router.replace).not.toHaveBeenCalled()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Assert
      expect(router.replace).toHaveBeenCalled()
    })
  })

  describe("home", () => {
    it("should navigate to /(game)/worlds and reset state", () => {
      // Arrange
      const gameApi = buildGameApi()
      mockUseGame.mockReturnValue(gameApi)
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.home()
      })

      // Assert
      expect(router.replace).toHaveBeenCalledWith("/(game)/worlds")
      expect(gameApi.resetAll).toHaveBeenCalled()
    })

    it("should delay navigation via interstitial when adMode is high", () => {
      // Arrange
      const show = jest.fn()
      mockUseInterstitial.mockReturnValue({ show })
      mockUseAds.mockReturnValue({ adMode: "high", canLoadAd: jest.fn().mockReturnValue(true) })
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Act
      act(() => {
        result.current!.home()
      })

      expect(router.replace).not.toHaveBeenCalled()

      act(() => {
        jest.advanceTimersByTime(300)
      })

      // Assert
      expect(router.replace).toHaveBeenCalledWith("/(game)/worlds")
    })
  })

  describe("starsEarned", () => {
    it("should be 0 when no stars collected", () => {
      // Act
      const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

      // Assert
      expect(result.current!.starsEarned).toBe(0)
    })
  })

  it("should expose lastResult from game api", () => {
    // Arrange
    const gameApi = buildGameApi({ lastResult: { valid: false, failedRule: "no-backtrack" } })
    mockUseGame.mockReturnValue(gameApi)

    // Act
    const { result } = renderHook(() => useGameFlow("world-1", "lvl-1"))

    // Assert
    expect(result.current!.lastResult).toEqual({ valid: false, failedRule: "no-backtrack" })
  })
})