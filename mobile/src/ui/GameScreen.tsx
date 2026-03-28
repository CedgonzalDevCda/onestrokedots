import { View, Modal, Text as RNText, Pressable } from "react-native"
import Svg, { Circle, Text, Polyline, G } from "react-native-svg"
import { useMemo, useState } from "react"
import { Point } from "@/src/core/models/Point"
import { useGame } from "@/src/hooks/useGame"
import { AdBanner } from "@/src/ads/AdBanner"
import { useInterstitial } from "@/src/ads/useInterstitial"
import { useAds } from "@/src/ads/AdProvider"

const levelPoints: Point[] = [
  { id: "1", x: 100, y: 340, value: 1, radius: 32 },
  { id: "2", x: 200, y: 340, value: 2, radius: 32 },
  { id: "3", x: 300, y: 340, value: 2, radius: 32 },
  { id: "4", x: 100, y: 440, value: 1, radius: 32 },
  { id: "5", x: 200, y: 440, value: 2, radius: 32 },
  { id: "6", x: 300, y: 440, value: 2, radius: 32 },
  { id: "7", x: 100, y: 540, value: 1, radius: 32 },
  { id: "8", x: 200, y: 540, value: 2, radius: 32 },
  { id: "9", x: 300, y: 540, value: 2, radius: 32 },
]

export default function GameScreen() {
  const [showModal, setShowModal] = useState(false)

  const { adMode, canLoadAd } = useAds()
  const { show } = useInterstitial()

  const {
    path,
    visited,
    handleStart,
    handleMove,
    handleEnd
  } = useGame(levelPoints)

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
    if (!result) return

    if (adMode === "high" && canLoadAd()) {
      show()
    } else {
      setShowModal(true)
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>

      {/* 🔝 HEADER */}
      <View style={{
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <RNText style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>
          Level 1
        </RNText>

        <Pressable style={{
          backgroundColor: "#1e293b",
          paddingHorizontal: 14,
          paddingVertical: 8,
          borderRadius: 8
        }}>
          <RNText style={{ color: "white" }}>Reset</RNText>
        </Pressable>
      </View>

      {/* 🎮 ZONE DE JEU */}
      <View
        style={{ flex: 1 }}
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
      >
        <Svg width="100%" height="100%">

          {/* ✏️ PATH */}
          <Polyline
            points={path.map(p => `${p.x},${p.y}`).join(" ")}
            stroke="#38bdf8"
            strokeWidth={8}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />

          {/* 🔵 POINTS */}
          {levelPoints.map(p => {
            const count = visited[p.id] ?? 0

            let fillColor = "white"
            let strokeColor = "#000"

            if (count > 0 && count < p.value) {
              fillColor = "#93c5fd" // en cours
            }

            if (count === p.value) {
              fillColor = "#22c55e" // validé ✅
            }

            if (count > p.value) {
              fillColor = "#ef4444" // erreur ❌
            }

            return (
              <G key={p.id}>
                <Circle
                  cx={p.x}
                  cy={p.y}
                  r={p.radius}
                  stroke={strokeColor}
                  strokeWidth={3}
                  fill={fillColor}
                />

                {/* compteur dynamique */}
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
          })}

        </Svg>
      </View>

      {/* 📢 BANNER */}
      <View style={{
        width: "100%",
        alignItems: "center",
        backgroundColor: "#000"
      }}>
        <AdBanner placement="home" />
      </View>

      {/* 🎉 MODAL */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.6)",
          justifyContent: "center",
          alignItems: "center"
        }}>
          <View style={{
            backgroundColor: "white",
            padding: 30,
            borderRadius: 16,
            alignItems: "center",
            width: 260
          }}>
            <RNText style={{ fontSize: 22, marginBottom: 10 }}>
              🎉 Niveau validé !
            </RNText>

            <Pressable
              onPress={() => setShowModal(false)}
              style={{
                marginTop: 10,
                paddingVertical: 12,
                paddingHorizontal: 20,
                backgroundColor: "#22c55e",
                borderRadius: 10
              }}
            >
              <RNText style={{ color: "white", fontWeight: "bold" }}>
                Continuer
              </RNText>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  )
}
