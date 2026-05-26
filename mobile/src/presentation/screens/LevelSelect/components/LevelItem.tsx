import { Pressable, Text, StyleSheet } from "react-native"
import { useState } from "react"
import { router } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

import { progression } from "@/src/meta/progression/ProgressionService"
import StarsProgress from "./StarsProgress"
import LockedIcon from "@/assets/gameimg/locked-icon.svg"
import PurchaseModal from "./PurchaseModal"

export default function LevelItem({ worldId, level }: any) {
  const [showModal, setShowModal] = useState(false)
  const [, forceRefresh] = useState(0)

  // --- STATE LOGIC ---
  const isUnlocked = progression.isLevelUnlocked(worldId, level.id)
  const stars = progression.getStars(level.id)

  const isCompleted = stars > 0
  const isFullCompleted = stars === 3

  // --- ACTIONS ---
  const openLevel = () => {
    router.push({
      pathname: "/play",
      params: {
        worldId,
        levelId: level.id,
      },
    })
  }

  const handlePress = () => {
    if (!isUnlocked) return setShowModal(true)
    openLevel()
  }

  const handleBuy = async () => {
    const success = await progression.unlockLevel(worldId, level.id)

    if (!success) {
      alert("Not enough gold")
      return
    }

    setShowModal(false)
    forceRefresh(v => v + 1)
  }

  // --- UI HELPERS ---
  const renderContent = () => {
    if (!isUnlocked) {
      return <LockedIcon width={18} height={18} />
    }

    return (
      <>
        <Text style={styles.levelText}>
          {level.name.replace("Level ", "")}
        </Text>
        <StarsProgress stars={stars} maxStars={3} />
      </>
    )
  }

  const containerStyle = [
    styles.level,
    !isUnlocked
      ? styles.locked
      : isCompleted
      ? styles.completed
      : styles.available,
  ]

  // --- RENDER ---
  return (
    <>
      <Pressable style={containerStyle} onPress={handlePress}>
        {isFullCompleted ? (
          <LinearGradient
            colors={["#FFFFAA", "#FFA666"]}
            style={styles.inner}
          >
            {renderContent()}
          </LinearGradient>
        ) : (
          renderContent()
        )}
      </Pressable>

      <PurchaseModal
        visible={showModal}
        price={50}
        onCancel={() => setShowModal(false)}
        onConfirm={handleBuy}
      />
    </>
  )
}


const styles = StyleSheet.create({
  level: {
    width: 70,
    height: 70,
    margin: 10,
    borderRadius: 12,
    overflow: "hidden",
  },

  inner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  levelText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },

  available: {
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  completed: {
    backgroundColor: "#BBDEC5",
    justifyContent: "center",
    alignItems: "center",
  },

  locked: {
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
  },

  modalText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  yesBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },

  noBtn: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
