import { View, Text, TouchableOpacity, StyleSheet } from "react-native"

export default function PurchaseBlock({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Text style={styles.title}>
        Supprimer les pubs – 2.99€
      </Text>
      <Text style={styles.desc}>
        Supprime bannières + interstitielles (rewarded conservées)
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFF3E0",
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 13,
    color: "#666",
    marginTop: 5,
  },
})
