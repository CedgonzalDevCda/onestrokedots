import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"

import { World } from "@/src/core/models/World"
import { AdBanner } from "@/src/infrastructure/ads/AdBanner"
import { progression } from "@/src/meta/progression/ProgressionService"

import StarCompleted from "@/assets/gameimg/star-completed.svg"
import StarEmpty from "@/assets/gameimg/star-not-completed.svg"

type Props = {
  world: World
}

export default function LevelSelect({ world }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <AdBanner placement="world_levels" />
      </View>

      <Pressable
        onPress={() => router.back()}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>⬅️</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>{world.name}</Text>

        <View style={styles.grid}>
          {world.levelList.map((level) => {
            const isUnlocked = progression.isLevelUnlocked(
              world.id,
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
                      worldId: world.id,
                      levelId: level.id
                    }
                  })
                }}
              >
                <Text style={styles.levelText}>
                  {level.name.replace("Level ", "")}
                </Text>

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

  backBtn: {
    marginTop: 10,
    marginRight: 10,
    alignSelf: "flex-end",
    backgroundColor: "#222",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },

  backText: {
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
})
