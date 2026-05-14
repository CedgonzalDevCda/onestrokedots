import { View, StyleSheet, Dimensions } from "react-native";
import StoreBg from "@/assets/gameimg/store_bg.svg";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ShopHeader from "@/src/presentation/features/shop/ShopHeader";
import ShopGrid from "@/src/presentation/features/shop/ShopGrid";
import CurrencyToggle, { Currency } from "@/src/presentation/features/shop/CurrencyToggle";
import CurrencyBar from "@/src/presentation/features/shop/CurrencyBar";

const { width, height } = Dimensions.get("window");

const BG_WIDTH = width * 0.9;
const BG_HEIGHT = height * 0.9;

export default function ShopScreen() {
  const router = useRouter();

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>

      {/* ✅ Background */}
      <View style={styles.bgWrapper}>
        <StoreBg
          width={BG_WIDTH}
          height={BG_HEIGHT}
          preserveAspectRatio="xMidYMid meet"
        />
      </View>

      {/* ✅ HEADER */}
      <View style={styles.header}>
        <ShopHeader onBack={() => router.push("/(main)/home")} />
        <CurrencyBar style={{ marginTop: 10 }} />
      </View>

      {/* ✅ GRID centrée EXACTEMENT dans le SVG */}
      <View style={styles.gridZone}>
        <ShopGrid />
      </View>

      {/* ✅ BOTTOM */}
      <View style={styles.bottom}>
        <CurrencyToggle
          onChange={(value: Currency) => {
            console.log("Selected:", value);
          }}
        />
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  bgWrapper: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  header: {
    position: "absolute",
    top: 0 ,
    width: "100%",
    alignItems: "center",
  },

  /**
   * ✅ LA CLÉ ICI
   * On recrée EXACTEMENT la position du SVG
   */
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
