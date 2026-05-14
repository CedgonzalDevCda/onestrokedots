import { LinearGradient } from "expo-linear-gradient"
import { View, ScrollView, StyleSheet } from "react-native"
import { World } from "@/src/core/models/World"
import { AdBanner } from "@/src/infrastructure/ads/AdBanner"

import LevelSelectHeader from "./components/LevelSelectHeader"
import LevelGrid from "./components/LevelGrid"
import GameHeader from "@/src/presentation/ui/GameHeader"

type Props = {
  world: World
}

export default function LevelSelect({ world }: Props) {
  return (
    <LinearGradient
      colors={["#0F172A", "#283E74"]}
      style={styles.container}
    >
              <GameHeader />
      <LevelSelectHeader title={world.name} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LevelGrid world={world} />
      </ScrollView>

      {/* ✅ BANNIÈRE FIXE EN BAS */}
      <View style={styles.bottomBanner}>
        <AdBanner placement="world_levels" />
      </View>

    </LinearGradient>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomBanner: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },
})