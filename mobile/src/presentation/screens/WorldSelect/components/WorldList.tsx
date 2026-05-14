import { ScrollView, StyleSheet } from "react-native"

import { levelRepository } from "@/src/infrastructure/repositories/LevelRepository"
import { progression } from "@/src/meta/progression/ProgressionService"

import WorldCard from "@/src/presentation/screens/WorldSelect/components/WorldCard"

export default function WorldList() {
  const worlds = levelRepository.getWorlds()

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {worlds.map((world) => {
        const isUnlocked = progression.isWorldUnlocked(world.id)
        const completion = progression.getWorldCompletion(world.id)
        const isCompleted = completion === 100

        const levels = levelRepository.getLevelsByWorld(world.id)
        const completedLevels = levels.filter((l) =>
          progression.isLevelCompleted(l.id)
        ).length

        return (
          <WorldCard
            key={world.id}
            world={world}
            isUnlocked={isUnlocked}
            isCompleted={isCompleted}
            completedLevels={completedLevels}
            totalLevels={levels.length}
          />
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
})
