import { Polyline } from "react-native-svg"

export function PathLayer({ path }) {
  return (
    <Polyline
      points={path.map(p => `${p.x},${p.y}`).join(" ")}
      stroke="#38bdf8"
      strokeWidth={8}
      fill="none"
    />
  )
}
