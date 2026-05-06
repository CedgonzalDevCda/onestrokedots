import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onBack?: () => void;
};

export default function ShopHeader({ onBack }: Props) {
  return (
    <View style={styles.container}>

      {/* LEFT */}
      <View style={styles.side}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* CENTER */}
      <View style={styles.center}>
        <Text style={styles.title}>Shop</Text>
      </View>

      {/* RIGHT (symétrie) */}
      <View style={styles.side} />

    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    marginTop: 50,
    flexDirection: "row",
    alignItems: "center",
  },

  side: {
    width: 60, // ✅ espace fixe gauche/droite
    alignItems: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  backButton: {
    marginLeft: 10, // ✅ vraie marge gauche
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
});

