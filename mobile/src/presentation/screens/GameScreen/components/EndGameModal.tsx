import { View, Modal, Text as RNText, Pressable } from "react-native"
import { styles } from "../GameScreen.styles"

export function EndGameModal({
  visible,
  starsEarned,
  totalStars,
  onRetry,
  onNext,
  onHome,
}: any) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <RNText style={styles.modalTitle}>
            🎉 Niveau validé !
          </RNText>

          <RNText style={styles.modalStars}>
            ⭐ {starsEarned} / {totalStars}
          </RNText>

          <View style={styles.modalButtons}>
            <Pressable onPress={onRetry} style={styles.secondaryButton}>
              <RNText style={styles.secondaryText}>Retry</RNText>
            </Pressable>

            <Pressable onPress={onNext} style={styles.primaryButton}>
              <RNText style={styles.primaryText}>Next</RNText>
            </Pressable>

            <Pressable onPress={onHome} style={styles.secondaryButton}>
              <RNText style={styles.secondaryText}>Home</RNText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}
