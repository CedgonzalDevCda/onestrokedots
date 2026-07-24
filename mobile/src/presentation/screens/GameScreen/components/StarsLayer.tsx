// src/presentation/features/game/components/StarsLayer.tsx
import { G, Text } from "react-native-svg"

import StarEnabled from "@/assets/gameimg/star_w46_h46.svg"
import StarDisabled from "@/assets/gameimg/star_token_disabled_w46_h46.svg"

interface StarsLayerProps {
  stars: Array<{ id: string; x: number; y: number; size: number }>
  collectedStars: Record<string, boolean>
  isPathValid: boolean
  hasOrderedStarsRule?: boolean
}

export function StarsLayer({ 
  stars, 
  collectedStars, 
  isPathValid,
  hasOrderedStarsRule = false 
}: StarsLayerProps) {
  return stars.map((star) => {
    if (collectedStars[star.id]) return null

    const StarIcon = isPathValid ? StarEnabled : StarDisabled

    return (
      <G
        key={star.id}
        transform={`translate(${star.x - star.size / 2}, ${star.y - star.size / 2})`}
      >
        <StarIcon width={star.size} height={star.size} />

        {hasOrderedStarsRule && (
          <Text
            x={star.size / 2 - 5}
            y={star.size / 2}
            textAnchor="middle"
            fontSize={star.size * 0.25}
            fontWeight="bold"
            fill="#000000"
          >
            {star.id}
          </Text>
        )}
      </G>
    )
  })
}