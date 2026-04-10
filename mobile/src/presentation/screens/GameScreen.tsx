import { View, Modal, Text as RNText, Pressable } from "react-native"
import Svg, { Circle, Text, Polyline, G } from "react-native-svg"
import { useState } from "react"
import { useLocalSearchParams, router } from "expo-router"

import { useGame } from "@/src/presentation/hooks/useGame"
import { useLevelNavigation } from "@/src/presentation/hooks/useLevelNavigation"

// ✅ ✅ FIX ICI
import { progression } from "@/src/application/progression/ProgressionService"

import { AdBanner } from "@/src/ads/AdBanner"
import { useInterstitial } from "@/src/ads/useInterstitial"
import { useAds } from "@/src/ads/AdProvider"

import StarEnabled from "@/assets/gameimg/star_w46_h46.svg"
import StarDisabled from "@/assets/gameimg/star_token_disabled_w46_h46.svg"

import { styles } from "./GameScreen.styles"

type Star = {
  id: string
  x: number
  y: number
  size: number
}

type Point = {
  id: string
  x: number
  y: number
  radius: number
  value: number
}

export default function GameScreen() {
  const { worldId, levelId } = useLocalSearchParams()
  const { getLevel, getNextLevel } = useLevelNavigation()

  if (!worldId || !levelId) return null

  const levelData = getLevel(worldId as string, levelId as string)
  if (!levelData) return null

  const level = levelData
  const levelPoints: Point[] = level.PointList
  const stars: Star[] = level.StarList

  const [showModal, setShowModal] = useState(false)
  const [collectedStars, setCollectedStars] = useState<Record<string, boolean>>({})

  const { adMode, canLoadAd } = useAds()
  const { show } = useInterstitial()

  const {
    path,
    visited,
    isPathValid,
    handleStart,
    handleMove,
    handleEnd,
    resetAll,
  } = useGame(levelPoints, stars, collectedStars, setCollectedStars)

  function start(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleStart(locationX, locationY)
  }

  function move(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleMove(locationX, locationY)
  }

  function end() {
    const result = handleEnd()
    if (!result) return

    const starsEarned = Object.values(collectedStars).filter(Boolean).length

    // ✅ ✅ FIX PRINCIPAL
    progression.completeLevel(level.id, starsEarned)

    console.log("SAVE", level.id, starsEarned)
    console.log("STATE AFTER", progression.getState())

    if (adMode === "high" && canLoadAd()) {
      show()
    } else {
      setShowModal(true)
    }
  }

  function handleRetry() {
    setShowModal(false)
    setCollectedStars({})
    resetAll()
  }

  function handleNext() {
    setShowModal(false)
    setCollectedStars({})
    resetAll()

    const nextLevel = getNextLevel(worldId as string, level.id)

    if (nextLevel) {
      router.replace({
        pathname: "/play",
        params: {
          worldId: worldId as string,
          levelId: nextLevel.id,
        },
      })
    } else {
      router.replace("/")
    }
  }

  function handleHome() {
    setShowModal(false)
    setCollectedStars({})
    resetAll()

    router.replace("/")
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <RNText style={styles.title}>
          Level {level.id}
        </RNText>
      </View>

      <View
        style={styles.gameArea}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
        <Svg width="100%" height="100%">

          {stars.map((star: Star) => {
            if (collectedStars[star.id]) return null

            const StarIcon = isPathValid ? StarEnabled : StarDisabled

            return (
              <G
                key={star.id}
                transform={`translate(${star.x - star.size / 2}, ${star.y - star.size / 2})`}
              >
                <StarIcon width={star.size} height={star.size} />
              </G>
            )
          })}

          <Polyline
            points={path.map(p => `${p.x},${p.y}`).join(" ")}
            stroke="#38bdf8"
            strokeWidth={8}
            fill="none"
          />

          {levelPoints.map((p: Point) => {
            const count = visited[p.id] ?? 0

            let fillColor = "white"
            if (count > 0 && count < p.value) fillColor = "#93c5fd"
            if (count === p.value) fillColor = "#22c55e"
            if (count > p.value) fillColor = "#ef4444"

            return (
              <G key={p.id}>
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={p.radius}
                  stroke="#000"
                  strokeWidth={3}
                  fill={fillColor}
                />
                <Text
                  x={p.x}
                  y={p.y + 6}
                  fontSize="18"
                  fill="black"
                  textAnchor="middle"
                >
                  {p.value - count}
                </Text>
              </G>
            )
          })}
        </Svg>
      </View>

      <View style={styles.bannerContainer}>
        <AdBanner placement="home" />
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <RNText style={styles.modalTitle}>
              🎉 Niveau validé !
            </RNText>

            <RNText style={styles.modalStars}>
              ⭐ {Object.values(collectedStars).filter(Boolean).length} / {stars.length}
            </RNText>

            <View style={styles.modalButtons}>

              <Pressable onPress={handleRetry} style={styles.secondaryButton}>
                <RNText style={styles.secondaryText}>Retry</RNText>
              </Pressable>

              <Pressable onPress={handleNext} style={styles.primaryButton}>
                <RNText style={styles.primaryText}>Next</RNText>
              </Pressable>

              <Pressable onPress={handleHome} style={styles.secondaryButton}>
                <RNText style={styles.secondaryText}>Home</RNText>
              </Pressable>

            </View>
          </View>
        </View>
      </Modal>

    </View>
  )
}
