import { useLocalSearchParams } from "expo-router"
import LevelSelect from "@/src/presentation/screens/LevelSelect/LevelSelect"
import { levelRepository } from "@/src/infrastructure/repositories/LevelRepository"

export default function Levels() {
  const { worldId } = useLocalSearchParams()

  const id = Array.isArray(worldId) ? worldId[0] : worldId

  if (!id) return null

  const world = levelRepository.getWorldById(id)

  if (!world) return null

  return <LevelSelect world={world} />
}
