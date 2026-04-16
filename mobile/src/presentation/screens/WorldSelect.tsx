import { LinearGradient } from "expo-linear-gradient"
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"

import LockedIcon from "@/assets/gameimg/locked-icon.svg"

import { AdBanner } from "@/src/ads/AdBanner"
import GameHeader from "@/src/presentation/components/GameHeader"

import { levelRepository } from "@/src/data/repositories/LevelRepository"
import { progression } from "@/src/application/progression/ProgressionService"

export default function WorldSelect() {
  const worlds = levelRepository.getWorlds()

  return (
    <LinearGradient
      colors={["#0F172A", "#283E74"]}
      style={styles.container}
    >
      {/* ✅ HEADER + BANNER EN ABSOLU */}
      <View style={styles.topOverlay}>
        <View style={styles.banner}>
          <AdBanner placement="world_list" />
        </View>
        <GameHeader />
      </View>

      {/* ✅ CONTENU CENTRÉ FULL SCREEN */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {worlds.map((world) => {
          const isUnlocked = progression.isWorldUnlocked(world.id)
          const completion = progression.getWorldCompletion(world.id)
          const isCompleted = completion === 100

          const levels = levelRepository.getLevelsByWorld(world.id)
          const completedLevels = levels.filter((l) =>
            progression.isLevelCompleted(l.id)
          ).length
          const totalLevels = levels.length

          return (
            <Pressable
              key={world.id}
              style={[
                styles.world,
                isCompleted
                  ? styles.completed
                  : isUnlocked
                  ? styles.available
                  : styles.locked
              ]}
              onPress={() => {
                if (!isUnlocked) return

                router.push({
                  pathname: "/(game)/levels/[worldId]",
                  params: { worldId: world.id }
                })
              }}
            >
              <View style={styles.worldContent}>
                <Text
                  style={[
                    styles.worldText,
                    isCompleted && styles.worldTextCompleted
                  ]}
                >
                  {world.name}
                </Text>
              </View>

              <Text
                style={[
                  styles.levelCount,
                  isCompleted && styles.levelCountCompleted
                ]}
              >
                {completedLevels} / {totalLevels}
              </Text>

              {!isUnlocked && (
                <View style={styles.lockIcon}>
                  <LockedIcon width={20} height={20} />
                </View>
              )}
            </Pressable>
          )
        })}
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* ✅ overlay en haut */
  topOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },

  banner: {
    marginTop: 40,
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 4,
  },

  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  world: {
    width: "80%",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },

  worldContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  worldText: {
    fontSize: 18,
    color: "#fff",
    textAlign: "center",
    fontFamily: "Roboto",
  },

  worldTextCompleted: {
    color: "#000",
  },

  completed: {
    backgroundColor: "#FFCC26",
  },

  available: {
    backgroundColor: "#426EFF",
  },

  locked: {
    backgroundColor: "#08071A",
  },

  lockIcon: {
    backgroundColor: "#222",
    padding: 8,
    borderRadius: 8,
  },

  levelCount: {
    position: "absolute",
    bottom: 10,
    right: 15,
    fontSize: 13,
    color: "#eee",
  },

  levelCountCompleted: {
    color: "#000",
  },
})
