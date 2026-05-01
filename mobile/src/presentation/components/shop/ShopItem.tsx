import { View, Text, StyleSheet, Dimensions } from "react-native";
import MoneyIcon from "@/assets/gameimg/money-gold-icon.svg";

const { width } = Dimensions.get("window");
const BOX_SIZE = width * 0.22;

export default function ShopItem({ amount, price }) {
  return (
    <View style={styles.box}>
      <View style={styles.topRow}>
        <MoneyIcon width={40} height={40} />
        <Text style={styles.amount}>{amount}</Text>
      </View>

      <Text style={styles.price}>{price}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    backgroundColor: "#1E293B",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#FFD700",
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  amount: {
    color: "#FFD700",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 6,
  },

  price: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 6,
    fontWeight: "600",
    fontStyle: "italic",
  },
});
