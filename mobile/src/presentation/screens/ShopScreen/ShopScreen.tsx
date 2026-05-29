import { View, StyleSheet, Dimensions } from "react-native";
import StoreBg from "@/assets/gameimg/store_bg.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import ShopHeader from "@/src/presentation/features/shop/ShopHeader";
import ShopGrid from "@/src/presentation/features/shop/ShopGrid";
import CurrencyToggle, { Currency } from "@/src/presentation/features/shop/CurrencyToggle";
import CurrencyBar from "@/src/presentation/features/shop/CurrencyBar";

import { PRODUCTS } from "@/src/core/shop/catalog";
import { mapCurrencyToType } from "@/src/core/shop/mappers";

import { RevenueCatPurchaseService } from "@/src/infrastructure/iap/RevenueCatPurchaseService";

// ✅ NEW
import { ShopProduct } from "@/src/application/shop/types";

const purchaseService = new RevenueCatPurchaseService();

const { width, height } = Dimensions.get("window");

const BG_WIDTH = width * 0.9;
const BG_HEIGHT = height * 0.9;

export default function ShopScreen() {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>("Gold");

  const selectedType = mapCurrencyToType(currency);

  // ✅ core → filtered
  const filteredProducts = useMemo(
    () => PRODUCTS.filter((item) => item.type === selectedType),
    [selectedType]
  );

  // ✅ TEMP : enrichissement (simulation RevenueCat)
  const shopProducts: ShopProduct[] = useMemo(
    () =>
      filteredProducts.map((p) => ({
        ...p,
        price: getMockPrice(p.id),
      })),
    [filteredProducts]
  );

  const handlePurchase = async (productId: string) => {
    try {
      await purchaseService.purchaseProduct(productId);
      console.log("✅ Achat réussi:", productId);
    } catch (e) {
      console.log("❌ Achat échoué:", e);
    }
  };

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>
      <View style={styles.bgWrapper}>
        <StoreBg width={BG_WIDTH} height={BG_HEIGHT} />
      </View>

      <View style={styles.header}>
        <ShopHeader onBack={() => router.push("/(main)/home")} />
        <CurrencyBar style={{ marginTop: 10 }} />
      </View>

      <View style={styles.gridZone}>
        <ShopGrid
          products={shopProducts}
          onPressItem={handlePurchase}
        />
      </View>

      <View style={styles.bottom}>
        <CurrencyToggle onChange={setCurrency} />
      </View>
    </LinearGradient>
  );
}

// ✅ mock temporaire (à remplacer par RevenueCat)
const getMockPrice = (id: string): string => {
  switch (id) {
    case "gold_qty_1":
    case "bubble_qty_10":
    case "life_qty_2":
      return "2.99€";

    case "gold_qty_2":
    case "bubble_qty_20":
    case "life_qty_5":
      return "4.99€";

    case "gold_qty_5":
    case "bubble_qty_50":
    case "life_qty_10":
      return "9.99€";

    default:
      return "19.99€";
  }
};

const styles = StyleSheet.create({
  container: { flex: 1 },

  bgWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
  },

  gridZone: {
    position: "absolute",
    width: BG_WIDTH,
    height: BG_HEIGHT,
    top: (height - BG_HEIGHT) / 2,
    left: (width - BG_WIDTH) / 2,
    justifyContent: "center",
    alignItems: "center",
  },

  bottom: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
});
