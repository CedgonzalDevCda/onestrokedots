import { View, Text, Pressable, StyleSheet } from "react-native"
import { router } from "expo-router"

import LockedIcon from "@/assets/gameimg/locked-icon.svg"
import { World } from "@/src/core/models/World"

type Props = {
  world: World
  isUnlocked: boolean
  isCompleted: boolean
  completedLevels: number
  totalLevels: number
}

export default function WorldCard({
  world,
  isUnlocked,
  isCompleted,
  completedLevels,
  totalLevels,
}: Props) {
  return (
    <Pressable
      style={[
        styles.world,
        isCompleted
          ? styles.completed
          : isUnlocked
          ? styles.available
          : styles.locked,
      ]}
      onPress={() => {
        if (!isUnlocked) return

        router.push({
          pathname: "/(game)/levels/[worldId]",
          params: { worldId: world.id },
        })
      }}
    >
      <View style={styles.worldContent}>
        <Text
          style={[
            styles.worldText,
            isCompleted && styles.worldTextCompleted,
          ]}
        >
          {world.name}
        </Text>
      </View>

      <Text
        style={[
          styles.levelCount,
          isCompleted && styles.levelCountCompleted,
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
}

const styles = StyleSheet.create({
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