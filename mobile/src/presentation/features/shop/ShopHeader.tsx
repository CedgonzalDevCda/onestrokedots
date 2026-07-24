import { View, Text, StyleSheet } from "react-native";
import BackButton from "@/src/presentation/ui/components/BackButton";

type Props = {
  onBack?: () => void;
};

export default function ShopHeader({ onBack }: Props) {
  return (
    <View style={styles.container}>

      {/* LEFT */}
      <View style={styles.side}>
        {onBack && <BackButton onPress={onBack} />}
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
    width: 60,
    alignItems: "center",
  },

  center: {
    flex: 1,
    alignItems: "center",
  },

  title: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "bold",
  },
});
