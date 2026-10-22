import { View, Platform } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useEffect, useRef } from "react"
import { Audio } from "expo-av"

import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated"

import { styles } from "./HomeScreen.styles"

import HomeHeader from "./components/HomeHeader"
import HomeTitle from "./components/HomeTitle"
import HomeLogo from "./components/HomeLogo"
import HomeButtons from "./components/HomeButtons"
import NoAdsButton from "./components/NoAdsButton"

// Fonctionnalités indisponibles sur le web
const IS_WEB = Platform.OS === "web"

export default function HomeScreen() {
  const router = useRouter()
  const progress = useSharedValue(0)

  const soundRef = useRef<Audio.Sound | null>(null)

  // Animation
  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, {
        duration: 1600,
        easing: Easing.inOut(Easing.ease),
      }),
      -1,
      true
    )
  }, [progress])

  // 🎵 Musique
  useEffect(() => {
    async function playIntroMusic() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require("@/assets/sounds/music/intro.mp3"),
          {
            isLooping: true,
            volume: 0.5,
          }
        )

        soundRef.current = sound
        await sound.playAsync()
      } catch (e) {
        // Sur le web, l'autoplay est souvent bloqué par le navigateur
        console.log("Musique indisponible ou autoplay bloqué", e)
      }
    }

    playIntroMusic()

    return () => {
      soundRef.current?.unloadAsync()
    }
  }, [])

  return (
    <LinearGradient colors={["#0F172A", "#283E74"]} style={styles.container}>
      <HomeHeader />

      <View style={styles.content}>
        <HomeTitle progress={progress} />
        <HomeLogo progress={progress} />

        <HomeButtons
          onPlay={async () => {
            try {
              await soundRef.current?.stopAsync()
            } catch (e) {
              console.log("Erreur arrêt musique", e)
            }
            router.push("/worlds")
          }}
          onCollection={() => router.push("/collections")}
          onEditor={IS_WEB ? undefined : () => router.push("/editor")}
        />
      </View>

      {/* Achat "sans pub" : mobile uniquement */}
      {!IS_WEB && <NoAdsButton />}
    </LinearGradient>
  )
}