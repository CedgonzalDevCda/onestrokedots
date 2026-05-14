import { View } from "react-native"
import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated"

import LogoGame from "@/assets/gameimg/logo-game.svg"

type Props = {
  progress: Animated.SharedValue<number>
}

export default function HomeLogo({ progress }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(progress.value, [0, 1], [0.95, 1.1]),
        },
      ],
      opacity: interpolate(progress.value, [0, 1], [0.85, 1]),
    }
  })

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View style={animatedStyle}>
        <LogoGame width={157} height={130} />
      </Animated.View>
    </View>
  )
}
