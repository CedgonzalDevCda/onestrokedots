import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native"

const { width } = Dimensions.get("window")
const BOX_SIZE = width * 0.22

type ShopItemProps = {
  amount: number
  price: string
  productId: string
  icon: React.ReactNode
  onPress?: (productId: string) => void
}

export default function ShopItem({
  amount,
  price,
  productId,
  icon,
  onPress,
}: ShopItemProps) {
  return (
    <Pressable style={styles.box} onPress={() => onPress?.(productId)}>
      <View style={styles.topRow}>
        {icon}
        <Text style={styles.amount}>+{amount}</Text>
      </View>

      <Text style={styles.price}>{price}</Text>
    </Pressable>
  )
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
})
