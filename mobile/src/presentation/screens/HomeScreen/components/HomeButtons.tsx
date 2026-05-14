import { View, Text, Pressable } from "react-native"
import { styles } from "../HomeScreen.styles"

import PlayIcon from "@/assets/gameimg/play-icon.svg"
import CollectionIcon from "@/assets/gameimg/collection-icon.svg"

type Props = {
  onPlay: () => void
  onCollection: () => void
}

export default function HomeButtons({ onPlay, onCollection }: Props) {
  return (
    <View style={styles.buttonsRow}>
      <Pressable style={styles.squareButton} onPress={onPlay}>
        <PlayIcon width={50} height={50} />
        <Text style={styles.buttonText}>Jouer</Text>
      </Pressable>

      <Pressable style={styles.squareButton} onPress={onCollection}>
        <CollectionIcon width={50} height={50} />
        <Text style={styles.buttonText}>Collection</Text>
      </Pressable>
    </View>
  )
}
