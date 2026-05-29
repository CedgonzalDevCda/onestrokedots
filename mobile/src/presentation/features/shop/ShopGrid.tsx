import { View, StyleSheet, Dimensions } from "react-native";
import ShopItem from "./ShopItem";
import { ShopProduct } from "@/src/application/shop/types";

import GoldIcon from "@/assets/gameimg/money-gold-icon.svg";
import BubbleIcon from "@/assets/gameimg/money-bubble-icon.svg";
import LifeIcon from "@/assets/gameimg/money-life-icon.svg";

const { width } = Dimensions.get("window");
const ITEM_SIZE = width * 0.31;

type Props = {
  products: ShopProduct[];
  onPressItem: (id: string) => void;
};

const getIcon = (type: ShopProduct["type"]) => {
  switch (type) {
    case "gold":
      return <GoldIcon width={40} height={40} />;
    case "bubble":
      return <BubbleIcon width={40} height={40} />;
    case "life":
      return <LifeIcon width={40} height={40} />;
  }
};

export default function ShopGrid({ products, onPressItem }: Props) {
  return (
    <View style={styles.grid}>
      {products.map((item) => (
        <View key={item.id} style={styles.itemWrapper}>
          <ShopItem
            amount={item.amount}
            price={item.price}
            productId={item.id}
            icon={getIcon(item.type)}
            onPress={onPressItem}
          />
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
    alignSelf: "center",
  },

  itemWrapper: {
    width: ITEM_SIZE,
    alignItems: "center",
  },
});
