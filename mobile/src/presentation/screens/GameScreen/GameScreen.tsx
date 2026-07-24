// src/presentation/screens/GameScreen/GameScreen.tsx
import { View } from "react-native"
import { useLocalSearchParams } from "expo-router"

import { useGameFlow } from "@/src/presentation/hooks/useGameFlow"

import { AdBanner } from "@/src/infrastructure/ads/AdBanner"

import { styles } from "./GameScreen.styles"
import { GameBoard } from "./components/GameBoard"
import { EndGameModal } from "./components/EndGameModal"
import { RulesBadgeList } from "./components/RulesBadgeList"

export default function GameScreen() {
  const { worldId, levelId } = useLocalSearchParams()

  if (!worldId || !levelId) return null

  const flow = useGameFlow(worldId as string, levelId as string)
  if (!flow) return null

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

  const hasOrderedStarsRule = level.rules?.some(r => r.type === "ordered-stars") ?? false

  return (
    <View style={styles.container}>
      <View
        style={styles.gameArea}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
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
        />
      </View>

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