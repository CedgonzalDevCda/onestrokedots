import { useEffect, useState } from "react"
import { GetLevels } from "@/src/application/level/GetLevels"
import { LevelWithProgress } from "@/src/application/level/GetLevels"

export function useLevelsWithProgress(worldId: string) {
  const [levels, setLevels] = useState<LevelWithProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<unknown>(null)

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      try {
        setLoading(true)

        const result = await GetLevels(worldId)

        if (isMounted) {
          setLevels(result)
        }
      } catch (e) {
        if (isMounted) {
          setError(e)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    load()

    return () => {
      isMounted = false
    }
  }, [worldId])

  return {
    levels,
    loading,
    error,
  }
}
