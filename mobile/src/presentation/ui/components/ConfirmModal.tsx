import { Modal, View, Text, Pressable, StyleSheet } from "react-native"

type ConfirmModalProps = {
  visible: boolean
  text: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  cancelText?: string
}

export default function ConfirmModal({
  visible,
  text,
  onConfirm,
  onCancel,
  confirmText = "YES",
  cancelText = "NO",
}: ConfirmModalProps) {
  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.text}>{text}</Text>

          <View style={styles.buttons}>
            <Pressable style={styles.cancelBtn} onPress={onCancel}>
              <Text style={styles.btnText}>{cancelText}</Text>
            </Pressable>

            <Pressable style={styles.confirmBtn} onPress={onConfirm}>
              <Text style={styles.btnText}>{confirmText}</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
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

  text: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  confirmBtn: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
  },

  cancelBtn: {
    backgroundColor: "#F44336",
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
})
