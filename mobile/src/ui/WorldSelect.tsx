import { useState } from "react"
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView
} from "react-native"
import { router } from "expo-router"

import { World } from "@/src/core/models/World"
import { Level } from "@/src/core/models/Level"
import { AdBanner } from "@/src/ads/AdBanner"

const createLevels = (): Level[] => {
  const levels: Level[] = []

  for (let i = 1; i <= 12; i++) {
    levels.push({
      id: i.toString(),
      name: `Level ${i}`,
      isCompleted: false,
      isAvailable: i === 1,
      PointList: []
    })
  }

  return levels
}

const worlds: World[] = [
  {
    id: "1",
    name: "World 1",
    isAvailable: true,
    isCompleted: false,
    LevelList: createLevels()
  },
  {
    id: "2",
    name: "World 2",
    isAvailable: false,
    isCompleted: false,
    LevelList: []
  },
  {
    id: "3",
    name: "World 3",
    isAvailable: false,
    isCompleted: false,
    LevelList: []
  }
]

export default function WorldSelect() {
  const [selectedWorld, setSelectedWorld] = useState<World | null>(null)

  if (selectedWorld) {
    return (
      <View style={styles.container}>

        {/* ✅ Bannière */}
        <View style={styles.banner}>
          <AdBanner placement="world_levels" />
        </View>

        {/* ⚙️ SETTINGS sous bannière */}
        <Pressable
          onPress={() => router.push("/(game)/settings")}
          style={styles.settingsBtn}
        >
          <Text style={styles.settingsText}>⚙️</Text>
        </Pressable>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={styles.title}>{selectedWorld.name}</Text>

          <View style={styles.grid}>
            {selectedWorld.LevelList.map((level) => (
              <Pressable
                key={level.id}
                style={[
                  styles.level,
                  level.isAvailable ? styles.available : styles.locked
                ]}
                onPress={() => {
                  if (level.isAvailable) {
                    router.push("/play")
                  }
                }}
              >
                <Text style={styles.levelText}>
                  {level.name.replace("Level ", "")}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

      </View>
    )
  }

  return (
    <View style={styles.container}>

      {/* ✅ Bannière */}
      <View style={styles.banner}>
        <AdBanner placement="world_list" />
      </View>

      {/* ⚙️ SETTINGS sous bannière */}
      <Pressable
        onPress={() => router.push("/(game)/settings")}
        style={styles.settingsBtn}
      >
        <Text style={styles.settingsText}>⚙️</Text>
      </Pressable>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Worlds</Text>

        {worlds.map((world) => (
          <Pressable
            key={world.id}
            style={[
              styles.world,
              world.isAvailable ? styles.available : styles.locked
            ]}
            onPress={() => {
              if (world.isAvailable) {
                setSelectedWorld(world)
              }
            }}
          >
            <Text style={styles.worldText}>
              {world.name}
            </Text>
          </Pressable>
        ))}
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
  }
})
