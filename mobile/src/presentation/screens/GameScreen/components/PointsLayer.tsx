// src/presentation/components/PointsLayer.tsx
import { G, Circle, Text, Defs, LinearGradient, Stop } from "react-native-svg"
import { Point } from "@/src/core/models/Point"

type Props = {
  points: Point[]
  visited: Record<string, number>
  startPointIds?: Set<string>
  endPointIds?: Set<string>
}

const START_COLOR = "#FF87DB"
const END_COLOR = "#AA00FF"

export function PointsLayer({
  points,
  visited,
  startPointIds = new Set(),
  endPointIds = new Set(),
}: Props) {
  return points.map((p) => {
    const count = visited[p.id] ?? 0

    const isStart = startPointIds.has(p.id)
    const isEnd = endPointIds.has(p.id)
    const isBoth = isStart && isEnd

    // Priorité : le statut start/end écrase la couleur de progression,
    // pour que le joueur identifie toujours visuellement ces points clés.
    let fillColor: string | undefined
    let fillUrl: string | undefined

    if (isBoth) {
      fillUrl = `url(#gradient-${p.id})`
    } else if (isStart) {
      fillColor = START_COLOR
    } else if (isEnd) {
      fillColor = END_COLOR
    } else {
      if (count > 0 && count < p.value) fillColor = "#93c5fd"
      if (count === p.value) fillColor = "#22c55e"
      if (count > p.value) fillColor = "#ef4444"
      if (count === 0) fillColor = "white"
    }

    return (
      <G key={p.id}>
        {isBoth && (
          <Defs>
            <LinearGradient
              id={`gradient-${p.id}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <Stop offset="49%" stopColor={START_COLOR} />
              <Stop offset="51%" stopColor={END_COLOR} />
            </LinearGradient>
          </Defs>
        )}
        <Circle
          cx={p.x}
          cy={p.y}
          r={p.radius}
          stroke="#000"
          strokeWidth={3}
          fill={fillUrl ?? fillColor}
        />
        <Text
          x={p.x}
          y={p.y + 6}
          fontSize="18"
          fill="black"
          textAnchor="middle"
        >
          {p.value - count}
        </Text>
      </G>
    )
  })
}