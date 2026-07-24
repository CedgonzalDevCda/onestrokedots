// src/presentation/features/game/components/GameBoard.tsx
import Svg from "react-native-svg"
import { StarsLayer } from "./StarsLayer"
import { PointsLayer } from "./PointsLayer"
import { PathLayer } from "./PathLayer"

import { Star } from "@/src/core/models/Star"
import { Point } from "@/src/core/models/Point"

export type PathPoint = {
  x: number
  y: number
}

export type GameBoardProps = {
  stars: Star[]
  points: Point[]
  path: PathPoint[]
  visited: Record<string, number>
  collectedStars: Record<string, boolean>
  isPathValid: boolean
  startPointIds?: Set<string>
  endPointIds?: Set<string>
  hasOrderedStarsRule?: boolean
}

export function GameBoard({
  stars,
  points,
  path,
  visited,
  collectedStars,
  isPathValid,
  startPointIds,
  endPointIds,
  hasOrderedStarsRule = false,
}: GameBoardProps) {
  return (
    <Svg width="100%" height="100%">
      <StarsLayer 
        stars={stars} 
        collectedStars={collectedStars} 
        isPathValid={isPathValid}
        hasOrderedStarsRule={hasOrderedStarsRule}
      />

      <PathLayer path={path} />

      <PointsLayer
        points={points}
        visited={visited}
        startPointIds={startPointIds}
        endPointIds={endPointIds}
      />
    </Svg>
  )
}