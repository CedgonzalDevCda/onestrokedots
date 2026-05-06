import { LinearGradient } from "expo-linear-gradient";
import { View, Text, Pressable, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";

import LogoGame from "@/assets/gameimg/logo-game.svg";
import SlidingPanel, {
  SlidingPanelHandle,
} from "@/src/presentation/ui/SlidingPanel";
import AppMenuPanelContent from "@/src/presentation/features/menu/AppMenuPanelContent";

import { styles } from "./index.styles";

export default function StartPage() {
  const router = useRouter();

  const panelRef = useRef<SlidingPanelHandle>(null);

  const touchOpacity = useRef(new Animated.Value(0.5)).current;
  const introOpacity = useRef(new Animated.Value(1)).current;

  const [isIntroVisible, setIsIntroVisible] = useState(true);

  const [isScrolling, setIsScrolling] = useState(false);
  const [canDrag, setCanDrag] = useState(true); // ✅ AJOUT

  useEffect(() => {
    startTouchAnimation();
    const timeout = startIntroSequence();
    return () => clearTimeout(timeout);
  }, []);

  const startTouchAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(touchOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(touchOpacity, {
          toValue: 0.5,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startIntroSequence = () => {
    return setTimeout(() => {
      Animated.timing(introOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        setIsIntroVisible(false);
      });
    }, 2500);
  };

  const handleStart = () => {
    router.replace("/(main)/home" as any);
  };

  const openMenu = () => {
    panelRef.current?.expand();
  };

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>
      <Pressable style={styles.fullscreen} onPress={handleStart}>
        <View style={styles.header}>
          <View>
            <Text style={styles.info}>v1.0.0</Text>
            <Text style={styles.info}>Client #12345</Text>
          </View>

          <Pressable style={styles.burger} onPress={openMenu}>
            <Text style={styles.burgerText}>≡</Text>
          </Pressable>
        </View>

        <View style={styles.center}>
          <Text style={styles.title}>OneStrokeDots</Text>

          <LogoGame width={281.5} height={233} />

          <Animated.Text style={[styles.touchText, { opacity: touchOpacity }]}>
            Toucher pour commencer
          </Animated.Text>
        </View>
      </Pressable>

      {/* ✅ FIX ICI */}
      <SlidingPanel
        ref={panelRef}
        isScrollActive={isScrolling}
        canDrag={canDrag}
      >
        <AppMenuPanelContent
          clientId="12345"
          setIsScrolling={setIsScrolling}
          setCanDrag={setCanDrag}
        />
      </SlidingPanel>

      {isIntroVisible && (
        <Animated.View style={[styles.introOverlay, { opacity: introOpacity }]}>
          <Text style={styles.introText}>
            IndieMobileDev{"\n"}Creation{"\n\n"}Present
          </Text>
        </Animated.View>
      )}
    </LinearGradient>
  );
}
