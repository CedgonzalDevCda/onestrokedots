import { View, Text, Pressable } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from "react-native-reanimated";

import { styles } from "./home.styles";

import { AdBanner } from "@/src/ads/AdBanner";
import GameHeader from "@/src/presentation/components/GameHeader";

import LogoGame from "@/assets/gameimg/logo-game.svg";
import NoAdsIcon from "@/assets/gameimg/no-ads-icon.svg";
import PlayIcon from "@/assets/gameimg/play-icon.svg";
import CollectionIcon from "@/assets/gameimg/collection-icon.svg";


export default function Home() {
  const router = useRouter();

  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // ✅ Logo animation clean (scale + opacity)
  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.95, 1.1]);
    const opacity = interpolate(progress.value, [0, 1], [0.85, 1]);

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  // ✅ Title animation
  const titleStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0.7, 1]);

    return {
      opacity,
      textShadowColor: "#2DFFFF",
      textShadowOffset: { width: 0, height: 0 },
      textShadowRadius: interpolate(progress.value, [0, 1], [4, 12]),
    };
  });

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>

      {/* HEADER */}
      <View style={styles.topOverlay}>
        <View style={styles.banner}>
          <AdBanner placement="world_list" />
        </View>
        <GameHeader />
      </View>

      {/* CONTENT */}
      <View style={styles.content}>

        <Animated.Text style={[styles.title, titleStyle]}>
          OneStrokeDots
        </Animated.Text>

        {/* ✅ Logo clean */}
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Animated.View style={logoStyle}>
            <LogoGame width={157} height={130} />
          </Animated.View>
        </View>

        {/* No Ads */}
        <LinearGradient
          colors={["#FF6CEB", "#C30075"]}
          style={styles.noAdsBtn}
        >
          <NoAdsIcon width={42} height={42} />
          <Text style={styles.price}>$ 2.99</Text>
        </LinearGradient>

        {/* Buttons */}
        <View style={styles.buttonsRow}>
          {/* Jouer */}
          <Pressable
            style={styles.squareButton}
            onPress={() => router.push("/worlds")}
          >
            <PlayIcon width={50} height={50} />
            <Text style={styles.buttonText}>Jouer</Text>
          </Pressable>

          {/* Collection */}
          <Pressable
            style={styles.squareButton}
            onPress={() => router.push("/collections")}
          >
            <CollectionIcon width={50} height={50} />
            <Text style={styles.buttonText}>Collection</Text>
          </Pressable>
        </View>


      </View>
    </LinearGradient>
  );
}
