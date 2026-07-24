import { G } from "react-native-svg"

import StarEnabled from "@/assets/gameimg/star_w46_h46.svg"
import StarDisabled from "@/assets/gameimg/star_token_disabled_w46_h46.svg"

export function StarsLayer({ stars, collectedStars, isPathValid }) {
  return stars.map((star) => {
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
  })
}
