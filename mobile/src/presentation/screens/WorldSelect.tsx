import { useState, useCallback } from "react"
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView
} from "react-native"
import { router, useFocusEffect } from "expo-router"

import { World } from "@/src/game/models/World"
import { AdBanner } from "@/src/ads/AdBanner"
import { levelRepository } from "@/src/data/repositories/LevelRepository"
import { progression } from "@/src/application/progression/ProgressionService"

// ✅ SVG imports
import StarCompleted from "@/assets/gameimg/star-completed.svg"
import StarEmpty from "@/assets/gameimg/star-not-completed.svg"

export default function WorldSelect() {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)

  // ✅ FORCE REFRESH quand on revient sur l'écran
  const [, setRefresh] = useState(0)

  useFocusEffect(
    useCallback(() => {
      setRefresh(r => r + 1)
    }, [])
  )

  const worlds = levelRepository.getWorlds()

  // ✅ ================= LEVEL SCREEN =================
  if (selectedWorld) {
    return (
      <View style={styles.container}>

        <View style={styles.banner}>
          <AdBanner placement="world_levels" />
        </View>

        <Pressable
          onPress={() => setSelectedWorld(null)}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsText}>⬅️</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{selectedWorld.name}</Text>

          <View style={styles.grid}>
            {selectedWorld.levelList.map((level) => {
              const isUnlocked = progression.isLevelUnlocked(
                selectedWorld.id,
                level.id
              )

              const stars = progression.getStars(level.id)

              return (
                <Pressable
                  key={level.id}
                  style={[
                    styles.level,
                    isUnlocked ? styles.available : styles.locked
                  ]}
                  onPress={() => {
                    if (!isUnlocked) return

                    router.push({
                      pathname: "/play",
                      params: {
                        worldId: selectedWorld.id,
                        levelId: level.id
                      }
                    })
                  }}
                >
                  <Text style={styles.levelText}>
                    {level.name.replace("Level ", "")}
                  </Text>

                  {/* ⭐ Stars */}
                  <View style={styles.starsRow}>
                    {Array.from({ length: 3 }).map((_, i) => {
                      const Star = i < stars ? StarCompleted : StarEmpty
                      return <Star key={i} width={12} height={12} />
                    })}
                  </View>
                </Pressable>
              )
            })}
          </View>
        </ScrollView>
      </View>
    )
  }

  // ✅ ================= WORLD SCREEN =================
  return (
    <View style={styles.container}>

      <View style={styles.banner}>
        <AdBanner placement="world_list" />
      </View>

      <Pressable
        onPress={() => router.push("/(game)/settings")}
        style={styles.settingsBtn}
      >
        <Text style={styles.settingsText}>⚙️</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Worlds</Text>

        {worlds.map((world) => {
          const isUnlocked = progression.isWorldUnlocked(world.id)
          const completion = progression.getWorldCompletion(world.id)

          return (
            <Pressable
              key={world.id}
              style={[
                styles.world,
                isUnlocked ? styles.available : styles.locked
              ]}
              onPress={() => {
                if (!isUnlocked) return
                setSelectedWorld(world)
              }}
            >
              <Text style={styles.worldText}>
                {world.name}
              </Text>

              <Text style={styles.progress}>
                {completion}%
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  banner: {
    marginTop: 40,
    width: "100%",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 4,
  },

  settingsBtn: {
    marginTop: 10,
    marginRight: 10,
    alignSelf: "flex-end",
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  settingsText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  scrollContent: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 28,
    marginBottom: 30
  },

  world: {
    width: 200,
    padding: 20,
    margin: 10,
    borderRadius: 10,
    alignItems: "center"
  },

  worldText: {
    fontSize: 18
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: 300,
    justifyContent: "center"
  },

  level: {
    width: 60,
    height: 60,
    margin: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1
  },

  levelText: {
    fontSize: 18
  },

  available: {
    backgroundColor: "white"
  },

  locked: {
    backgroundColor: "#ccc"
  },

  starsRow: {
    flexDirection: "row",
    marginTop: 4,
    gap: 2
  },

  progress: {
    fontSize: 14,
    marginTop: 6,
    color: "#666"
  },
})
