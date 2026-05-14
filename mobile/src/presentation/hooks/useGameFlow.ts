import { useState } from "react"
import { router } from "expo-router"

import { useGame } from "@/src/presentation/hooks/useGame"
import { useLevelNavigation } from "@/src/presentation/hooks/useLevelNavigation"

import { progression } from "@/src/meta/progression/ProgressionService"

import { useInterstitial } from "@/src/infrastructure/ads/useInterstitial"
import { useAds } from "@/src/infrastructure/ads/AdProvider"

export function useGameFlow(worldId: string, levelId: string) {
  const { getLevel, getNextLevel } = useLevelNavigation()
  const { adMode, canLoadAd } = useAds()
  const { show } = useInterstitial()

  // -------------------------
  // LEVEL
  // -------------------------
  const level = getLevel(worldId, levelId)
  if (!level) return null

  const { PointList, StarList, id } = level

  // -------------------------
  // STATE
  // -------------------------
  const [showModal, setShowModal] = useState(false)
  const [collectedStars, setCollectedStars] = useState<Record<string, boolean>>({})

  // -------------------------
  // GAME ENGINE
  // -------------------------
  const game = useGame(
    PointList,
    StarList,
    collectedStars,
    setCollectedStars
  )

  // -------------------------
  // INPUT HANDLERS
  // -------------------------
  function start(e: any) {
    const { locationX, locationY } = e.nativeEvent
    game.handleStart(locationX, locationY)
  }

  function move(e: any) {
    const { locationX, locationY } = e.nativeEvent
    game.handleMove(locationX, locationY)
  }

  function end() {
    handleEndAsync()
  }

  // -------------------------
  // END GAME
  // -------------------------
  async function handleEndAsync() {
    const result = game.handleEnd()
    if (!result) return

    const starsEarned = Object.values(collectedStars).filter(Boolean).length

    await progression.completeLevel(id, starsEarned)

    if (adMode === "high" && canLoadAd()) {
      show()
    } else {
      setShowModal(true)
    }
  }

  // -------------------------
  // ACTIONS
  // -------------------------
  function retry() {
    setShowModal(false)
    setCollectedStars({})
    game.resetAll()
  }

  function next() {
    const nextLevel = getNextLevel(worldId, levelId)

    if (!nextLevel) {
      router.replace("/worlds")
      return
    }

    const goNext = () => {
      setShowModal(false)
      setCollectedStars({})
      game.resetAll()

      router.replace({
        pathname: "/play",
        params: {
          worldId,
          levelId: nextLevel.id,
        },
      })
    }

    if (adMode === "high" && canLoadAd()) {
      show()
      setTimeout(goNext, 300)
    } else {
      goNext()
    }
  }

  function home() {
    const goHome = () => {
      setShowModal(false)
      setCollectedStars({})
      game.resetAll()

      router.replace("/(game)/worlds")
    }

    if (adMode === "high" && canLoadAd()) {
      show()
      setTimeout(goHome, 300)
    } else {
      goHome()
    }
  }

  // -------------------------
  // DERIVED
  // -------------------------
  const starsEarned = Object.values(collectedStars).filter(Boolean).length

  // -------------------------
  // API
  // -------------------------
  return {
    level,
    gameState: game,
    collectedStars,
    // input
    start,
    move,
    end,
    // ui
    showModal,
    starsEarned,
    // actions
    retry,
    next,
    home,
  }
}
