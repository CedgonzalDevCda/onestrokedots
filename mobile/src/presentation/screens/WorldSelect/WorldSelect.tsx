import { LinearGradient } from "expo-linear-gradient"
import { View, StyleSheet } from "react-native"

import { AdBanner } from "@/src/infrastructure/ads/AdBanner"
import GameHeader from "@/src/presentation/ui/GameHeader"

import WorldList from "@/src/presentation/screens/WorldSelect/components/WorldList"
import BackButton from "../../ui/components/BackButton"
import { router } from "expo-router"

export default function WorldSelect() {
  return (
    <LinearGradient
      colors={["#0F172A", "#283E74"]}
      style={styles.container}
    >
      {/* ✅ HEADER INLINE */}
<View style={styles.topOverlay}>
  <GameHeader />

  <View style={styles.backButtonContainer}>
    <BackButton onPress={() => router.back()} />
  </View>
</View>

      {/* ✅ LIST */}
      <WorldList />
      {/* ✅ BANNIÈRE FIXE EN BAS */}
      <View style={styles.bottomBanner}>
        <AdBanner placement="world_list" />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  backButtonContainer: {
  marginTop: 30, // espace sous le header (settings)
  paddingHorizontal: 16,
},

  bottomBanner: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },

})
