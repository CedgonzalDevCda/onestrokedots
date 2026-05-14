import { G, Circle, Text } from "react-native-svg"

export function PointsLayer({ points, visited }) {
  return points.map((p) => {
    const count = visited[p.id] ?? 0

    let fillColor = "white"
    if (count > 0 && count < p.value) fillColor = "#93c5fd"
    if (count === p.value) fillColor = "#22c55e"
    if (count > p.value) fillColor = "#ef4444"

    return (
      <G key={p.id}>
        <Circle
          cx={p.x}
          cy={p.y}
          r={p.radius}
          stroke="#000"
          strokeWidth={3}
          fill={fillColor}
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
