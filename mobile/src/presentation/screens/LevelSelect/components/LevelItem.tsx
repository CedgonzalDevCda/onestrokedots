import { Pressable, Text, StyleSheet, View } from "react-native"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

import { progression } from "@/src/meta/progression/ProgressionService"
import StarsProgress from "./StarsProgress"
import LockedIcon from "@/assets/gameimg/locked-icon.svg"

export default function LevelItem({ worldId, level }: any) {
  const isUnlocked = progression.isLevelUnlocked(worldId, level.id)
  const stars = progression.getStars(level.id)

  const isCompleted = stars > 0
  const isFullCompleted = stars === 3

  const handlePress = () => {
    if (!isUnlocked) return

    router.push({
      pathname: "/play",
      params: {
        worldId,
        levelId: level.id,
      },
    })
  }

  // 🎨 CONTENU
  const content = (
    <>
      {!isUnlocked ? (
        <LockedIcon width={18} height={18} />
      ) : (
        <>
          <Text style={styles.levelText}>
            {level.name.replace("Level ", "")}
          </Text>
          <StarsProgress stars={stars} maxStars={3} />
        </>
      )}
    </>
  )

  // 🌟 FULL COMPLETED → GRADIENT
  if (isFullCompleted) {
    return (
      <Pressable onPress={handlePress} style={styles.level}>
        <LinearGradient
          colors={["#FFFFAA", "#FFA666"]}
          style={styles.inner}
        >
          {content}
        </LinearGradient>
      </Pressable>
    )
  }

  // ✅ COMPLETED / 🔒 LOCKED / ⚪ AVAILABLE
  return (
    <Pressable
      style={[
        styles.level,
        isUnlocked
          ? isCompleted
            ? styles.completed
            : styles.available
          : styles.locked,
      ]}
      onPress={handlePress}
    >
      {content}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  level: {
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  available: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  completed: {
    backgroundColor: "#BBDEC5",
    justifyContent: "center",
    alignItems: "center",
  },

  locked: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
})
