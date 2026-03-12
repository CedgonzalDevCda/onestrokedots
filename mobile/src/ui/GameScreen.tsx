import { View, Modal, Text as RNText, Pressable } from "react-native"
import Svg, { Circle, Text, Polyline, G } from "react-native-svg"
import { useMemo, useState } from "react"
import { Point } from "@/src/core/models/Point"
import { useGame } from "@/src/hooks/useGame"

const levelPoints: Point[] = [
  { id: "1", x: 80, y: 120, value: 3, radius: 30 },
  { id: "2", x: 250, y: 120, value: 2, radius: 30 },
  { id: "3", x: 160, y: 300, value: 2, radius: 30 }
]

function randomColor() {
  const r = Math.floor(Math.random() * 200)
  const g = Math.floor(Math.random() * 200)
  const b = Math.floor(Math.random() * 200)
  return `rgb(${r},${g},${b})`
}

export default function GameScreen() {

  const [showModal, setShowModal] = useState(false)

  const {
    path,
    visited,
    handleStart,
    handleMove,
    handleEnd
  } = useGame(levelPoints)

  const pointColors = useMemo(() => {

    const colors: Record<string, string> = {}

    levelPoints.forEach(p => {
      colors[p.id] = randomColor()
    })

    return colors

  }, [])

  function start(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleStart(locationX, locationY)
  }

  function move(e: any) {
    const { locationX, locationY } = e.nativeEvent
    handleMove(locationX, locationY)
  }

  function end() {

    const result = handleEnd()

    console.log("RESULT:", result)

    if (result) {
      setShowModal(true)
    }

  }

  return (
    <View
      style={{ flex: 1 }}
      onTouchStart={start}
      onTouchMove={move}
      onTouchEnd={end}
    >

      <Svg width="100%" height="100%">

        <Polyline
          points={path.map(p => `${p.x},${p.y}`).join(" ")}
          stroke="blue"
          strokeWidth={6}
          fill="none"
        />

        {levelPoints.map(p => {

          const isVisited = (visited[p.id] ?? 0) > 0
          const fillColor = isVisited ? pointColors[p.id] : "white"

          return (
            <G key={p.id}>

              <Circle
                cx={p.x}
                cy={p.y}
                r={p.radius}
                stroke="black"
                strokeWidth={3}
                fill={fillColor}
              />

              <Text
                x={p.x}
                y={p.y + 6}
                fontSize="20"
                fill="black"
                textAnchor="middle"
              >
                {p.value}
              </Text>

            </G>
          )
        })}

      </Svg>

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center"
          }}
        >

          <View
            style={{
              backgroundColor: "white",
              padding: 30,
              borderRadius: 12,
              alignItems: "center"
            }}
          >

            <RNText style={{ fontSize: 22, marginBottom: 10 }}>
              🎉 Niveau validé !
            </RNText>

            <Pressable
              onPress={() => setShowModal(false)}
              style={{
                marginTop: 10,
                padding: 10,
                backgroundColor: "#4CAF50",
                borderRadius: 8
              }}
            >
              <RNText style={{ color: "white" }}>
                Continuer
              </RNText>
            </Pressable>

          </View>

        </View>
      </Modal>

    </View>
  )
}
