import { View } from "react-native"
import { styles } from "../HomeScreen.styles"

import { AdBanner } from "@/src/infrastructure/ads/AdBanner"
import GameHeader from "@/src/presentation/ui/GameHeader"

export default function HomeHeader() {
  return (
    <View style={styles.topOverlay}>
      <GameHeader />
    </View>
  )
}
