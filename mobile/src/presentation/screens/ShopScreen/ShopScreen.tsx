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

import { ShopProduct } from "@/src/application/shop/types";

const purchaseService = new RevenueCatPurchaseService();

const { width, height } = Dimensions.get("window");

// Ratio réel du SVG (viewBox="0 0 338 330")
const SVG_VIEWBOX_WIDTH = 338;
const SVG_VIEWBOX_HEIGHT = 330;
const SVG_RATIO = SVG_VIEWBOX_WIDTH / SVG_VIEWBOX_HEIGHT;

// On part de la largeur voulue (90% de l'écran), et on calcule la hauteur EN RESPECTANT le ratio du SVG
const BG_WIDTH = width * 0.9;
const BG_HEIGHT = BG_WIDTH / SVG_RATIO;

// Coordonnées du rectangle utile dans le SVG d'origine (path: x 36→305, y 32→327)
const RECT_LEFT_RATIO = 36 / SVG_VIEWBOX_WIDTH;
const RECT_RIGHT_RATIO = 305 / SVG_VIEWBOX_WIDTH;
const RECT_TOP_RATIO = 32 / SVG_VIEWBOX_HEIGHT;
const RECT_BOTTOM_RATIO = 327 / SVG_VIEWBOX_HEIGHT;

const innerLeft = BG_WIDTH * RECT_LEFT_RATIO;
const innerTop = BG_HEIGHT * RECT_TOP_RATIO;
const innerWidth = BG_WIDTH * (RECT_RIGHT_RATIO - RECT_LEFT_RATIO);
const innerHeight = BG_HEIGHT * (RECT_BOTTOM_RATIO - RECT_TOP_RATIO);

export default function ShopScreen() {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>("Gold");

  const shopProducts: ShopProduct[] = useMemo(() => {
    const type = mapCurrencyToType(currency);

    return PRODUCTS
      .filter((p) => p.type === type)
      .map((p) => ({
        ...p,
        price: getMockPrice(p.id),
      }));
  }, [currency]);

  const handlePurchase = async (productId: string) => {
    try {
      await purchaseService.purchaseProduct(productId);
    } catch (e) {
      console.warn("Purchase failed", e);
    }
  };

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>
      <View style={styles.bgWrapper}>
        <StoreBg width={BG_WIDTH} height={BG_HEIGHT} />

        <View
          style={[
            styles.gridInner,
            {
              top: innerTop,
              left: innerLeft,
              width: innerWidth,
              height: innerHeight,
            },
          ]}
        >
          <ShopGrid
            products={shopProducts}
            onPressItem={handlePurchase}
          />
        </View>
      </View>

      <View style={styles.header}>
        <ShopHeader onBack={() => router.push("/(main)/home")} />
        <CurrencyBar style={{ marginTop: 10 }} />
      </View>

      <View style={styles.bottom}>
        <CurrencyToggle onChange={setCurrency} />
      </View>
    </LinearGradient>
  );
}

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
  container: {
    flex: 1,
  },

  bgWrapper: {
    position: "absolute",
    width: BG_WIDTH,
    height: BG_HEIGHT,
    top: (height - BG_HEIGHT) / 2,
    left: (width - BG_WIDTH) / 2,
  },

  gridInner: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute",
    top: 0,
    width: "100%",
    alignItems: "center",
  },

  bottom: {
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center",
  },
});