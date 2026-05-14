import { View, StyleSheet } from "react-native"
import { World } from "@/src/core/models/World"
import LevelItem from "./LevelItem"

export default function LevelGrid({ world }: { world: World }) {
  return (
    <View style={styles.grid}>
      {world.levelList.map((level) => (
        <LevelItem
          key={level.id}
          worldId={world.id}
          level={level}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    justifyContent: "center"
  },
})