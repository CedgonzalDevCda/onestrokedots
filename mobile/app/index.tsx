import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Pressable, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import LogoGame from "@/assets/gameimg/logo-game.svg";

import { styles } from "./index.styles";

export default function StartPage() {
  const router = useRouter();
  const opacity = useRef(new Animated.Value(0.5)).current;

  const [showIntro, setShowIntro] = useState(true);
  const introOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // animation texte "Toucher pour commencer"
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // intro 1s puis fade out
    setTimeout(() => {
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setShowIntro(false);
      });
    }, 2500);
  }, []);

  const handleStart = () => {
    router.replace("/(main)/home" as any);
  };

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>
      <Pressable style={{ flex: 1 }} onPress={handleStart}>
        
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.info}>v1.0.0</Text>
            <Text style={styles.info}>Client #12345</Text>
          </View>

          <Pressable style={styles.burger}>
            <Text style={styles.burgerText}>≡</Text>
          </Pressable>
        </View>

        {/* Center */}
        <View style={styles.center}>
          <Text style={styles.title}>OneStrokeDots</Text>

          <LogoGame width={281.5} height={233} />

          <Animated.Text style={[styles.touchText, { opacity }]}>
            Toucher pour commencer
          </Animated.Text>
        </View>
      </Pressable>

      {/* ✅ INTRO OVERLAY */}
      {showIntro && (
        <Animated.View
          style={[
            {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#0F172A",
              opacity: introOpacity,
              zIndex: 999,
            },
          ]}
        >
          <Text
            style={{
              color: "#fff",
              fontSize: 28,
              fontWeight: "600",
              textAlign: "center",
            }}
          >
            IndieMobileDevCreation Present
          </Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
