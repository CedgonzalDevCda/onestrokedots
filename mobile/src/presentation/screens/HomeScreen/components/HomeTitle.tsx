import Animated, {
  useAnimatedStyle,
  interpolate,
} from "react-native-reanimated"

import { styles } from "../HomeScreen.styles"

type Props = {
  progress: Animated.SharedValue<number>
}

export default function HomeTitle({ progress }: Props) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(progress.value, [0, 1], [0.7, 1]),
      textShadowColor: "#2DFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: interpolate(progress.value, [0, 1], [4, 12]),
    }
  })

  return (
    <Animated.Text style={[styles.title, animatedStyle]}>
      OneStrokeDots
    </Animated.Text>
  )
}
