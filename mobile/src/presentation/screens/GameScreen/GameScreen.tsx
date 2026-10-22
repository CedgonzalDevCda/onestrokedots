// src/presentation/screens/GameScreen/GameScreen.tsx
import { useState } from "react"
import { View, LayoutChangeEvent } from "react-native"
import { useLocalSearchParams } from "expo-router"
import { Gesture, GestureDetector } from "react-native-gesture-handler"

import { useGameFlow } from "@/src/presentation/hooks/useGameFlow"
import { AdBanner } from "@/src/infrastructure/ads/AdBanner"

import { styles } from "./GameScreen.styles"
import { GameBoard } from "./components/GameBoard"
import { EndGameModal } from "./components/EndGameModal"
import { RulesBadgeList } from "./components/RulesBadgeList"

// Taille de la zone de jeu pour laquelle les coordonnées des niveaux ont été pensées
const REF_WIDTH = 400
const REF_HEIGHT = 800

export default function GameScreen() {
  const { worldId, levelId } = useLocalSearchParams()
  const [area, setArea] = useState({ width: 0, height: 0 })

  const flow = useGameFlow(worldId as string, levelId as string)

  if (!worldId || !levelId || !flow) return null

  const {
    level,
    gameState,
    collectedStars,
    start,
    move,
    end,
    showModal,
    starsEarned,
    startPointIds,
    endPointIds,
    retry,
    next,
    home,
  } = flow

  const hasOrderedStarsRule =
    level.rules?.some((r) => r.type === "ordered-stars") ?? false

  // Ratio + centrage
  const scale =
    area.width > 0 && area.height > 0
      ? Math.min(area.width / REF_WIDTH, area.height / REF_HEIGHT)
      : 1
  const offsetX = (area.width - REF_WIDTH * scale) / 2
  const offsetY = (area.height - REF_HEIGHT * scale) / 2

  // Coordonnées du geste (locales à la zone) -> faux événement attendu par useGameFlow
  const toLevelEvent = (x: number, y: number) => ({
    nativeEvent: {
      locationX: (x - offsetX) / scale,
      locationY: (y - offsetY) / scale,
    },
  })

  // Un seul geste, identique sur mobile et sur web (souris + tactile)
  const pan = Gesture.Pan()
    .runOnJS(true)
    .minDistance(0)
    .onBegin((e) => start(toLevelEvent(e.x, e.y)))
    .onUpdate((e) => move(toLevelEvent(e.x, e.y)))
    .onFinalize(() => end())

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout
    setArea({ width, height })
  }

  return (
    <View style={styles.container}>
      <GestureDetector gesture={pan}>
        <View style={styles.gameArea} onLayout={onLayout}>
          {area.width > 0 && (
            <GameBoard
              stars={level.StarList}
              points={level.PointList}
              path={gameState.path}
              visited={gameState.visited}
              collectedStars={collectedStars}
              isPathValid={gameState.isPathValid}
              startPointIds={startPointIds}
              endPointIds={endPointIds}
              hasOrderedStarsRule={hasOrderedStarsRule}
              scale={scale}
              offsetX={offsetX}
              offsetY={offsetY}
            />
          )}
        </View>
      </GestureDetector>

      <RulesBadgeList rules={level.rules ?? []} />

      <View style={styles.bannerContainer}>
        <AdBanner placement="home" />
      </View>

      <EndGameModal
        visible={showModal}
        starsEarned={starsEarned}
        totalStars={level.StarList.length}
        onRetry={retry}
        onNext={next}
        onHome={home}
      />
    </View>
  )
}