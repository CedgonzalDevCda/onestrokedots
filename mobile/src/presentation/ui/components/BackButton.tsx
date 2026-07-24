import { TouchableOpacity, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"

type Props = {
  onPress: () => void
  color?: string
}

export default function BackButton({ onPress, color }: Props) {
  return (
    <TouchableOpacity style={styles.backButton} onPress={onPress}>
      <Ionicons name="arrow-back" size={20} color={color ?? "#0F172A"} />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },
})
