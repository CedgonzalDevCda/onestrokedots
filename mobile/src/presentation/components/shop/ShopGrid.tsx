import { View, StyleSheet, Dimensions } from "react-native";
import ShopItem from "./ShopItem";

const { width } = Dimensions.get("window");

// ✅ largeur calculée pour 2 colonnes
const ITEM_SIZE = width * 0.31;

const DATA = [
  { amount: "+1", price: "$2.99" },
  { amount: "+2", price: "$4.99" },
  { amount: "+5", price: "$9.99" },
  { amount: "+12", price: "$19.99" },
];

export default function ShopGrid() {
  return (
    <View style={styles.grid}>
      {DATA.map((item, index) => (
        <View key={index} style={styles.itemWrapper}>
          <ShopItem amount={item.amount} price={item.price} />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
grid: {
  marginTop: 210,
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignSelf: "center", // ✅ clé pour centrage parfait
},


  itemWrapper: {
    width: ITEM_SIZE, // ✅ force 2 colonnes
    alignItems: "center",
  },
});
