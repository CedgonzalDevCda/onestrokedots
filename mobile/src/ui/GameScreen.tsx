import { View, Modal, Text as RNText, Pressable } from "react-native"
import Svg, { Circle, Text, Polyline, G } from "react-native-svg"
import { useState, useMemo } from "react"
import { Point } from "@/src/core/models/Point"
import { useGame } from "@/src/hooks/useGame"
import { AdBanner } from "@/src/ads/AdBanner"
import { useInterstitial } from "@/src/ads/useInterstitial"
import { useAds } from "@/src/ads/AdProvider"
import StarEnabled from "../../assets/gameimg/star_w46_h46.svg"
import StarDisabled from "../../assets/gameimg/star_token_disabled_w46_h46.svg"
import { styles } from "./GameScreen.styles"

type Star = {
  id: string
  x: number
  y: number
  size: number
}

const levelPoints: Point[] = [
  { id: "1", x: 100, y: 240, value: 1, radius: 32 },
  { id: "2", x: 200, y: 240, value: 2, radius: 32 },
  { id: "3", x: 300, y: 240, value: 2, radius: 32 },
  { id: "4", x: 100, y: 340, value: 1, radius: 32 },
  { id: "5", x: 200, y: 340, value: 2, radius: 32 },
  { id: "6", x: 300, y: 340, value: 2, radius: 32 },
  { id: "7", x: 100, y: 440, value: 1, radius: 32 },
  { id: "8", x: 200, y: 440, value: 2, radius: 32 },
  { id: "9", x: 300, y: 440, value: 2, radius: 32 },
]

const initialStars: Star[] = [
  { id: "1", x: 150, y: 290, size: 60 },
  { id: "2", x: 250, y: 390, size: 60 },
  { id: "3", x: 150, y: 390, size: 60 },
]

export default function GameScreen() {
  const [showModal, setShowModal] = useState(false)
  const [stars, setStars] = useState(initialStars)
  const [collectedStars, setCollectedStars] = useState<Record<string, boolean>>({})

  const { adMode, canLoadAd } = useAds()
  const { show } = useInterstitial()

  const { path, visited, handleStart, handleMove, handleEnd } = useGame(levelPoints)

  // ✅ Vérifie si le tracé est valide
  const isPathValid = useMemo(() => {
    return levelPoints.every(p => (visited[p.id] ?? 0) === p.value)
  }, [visited])

  function checkStars(x: number, y: number) {
    // ❌ Bloqué si path invalide
    if (!isPathValid) return

    stars.forEach(star => {
      if (collectedStars[star.id]) return

      const dist = Math.hypot(x - star.x, y - star.y)
      if (dist <= star.size / 2) {
        setCollectedStars(prev => ({ ...prev, [star.id]: true }))
      }
    })
  }

  function resetStars() {
    setStars(initialStars)
    setCollectedStars({})
  }

  function start(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleStart(locationX, locationY)
    checkStars(locationX, locationY)
  }

  function move(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleMove(locationX, locationY)
    checkStars(locationX, locationY)
  }

  function end() {
    const result = handleEnd()

    if (!result) {
      resetStars()
      return
    }

    if (adMode === "high" && canLoadAd()) {
      show()
    } else {
      setShowModal(true)
    }
  }

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <RNText style={styles.title}>Level 1</RNText>

        <Pressable onPress={resetStars} style={styles.resetButton}>
          <RNText style={styles.resetText}>Reset</RNText>
        </Pressable>
      </View>

      <View
        style={styles.gameArea}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
        <Svg width="100%" height="100%">

          {stars.map(star => {
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
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {levelPoints.map(p => {
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
            <RNText style={styles.modalTitle}>🎉 Niveau validé !</RNText>

            <RNText>
              ⭐ {Object.keys(collectedStars).length} / {stars.length}
            </RNText>

            <Pressable
              onPress={() => {
                setShowModal(false)
                resetStars()
              }}
              style={styles.continueButton}
            >
              <RNText style={styles.continueText}>
                Continuer
              </RNText>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  )
}
