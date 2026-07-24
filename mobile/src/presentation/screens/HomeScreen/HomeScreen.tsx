import { View } from "react-native"
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
      const { sound } = await Audio.Sound.createAsync(
        require("@/assets/sounds/music/intro.mp3"),
        {
          isLooping: true,
          volume: 0.5,
        }
      )

      soundRef.current = sound
      await sound.playAsync()
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
            await soundRef.current?.stopAsync()
            router.push("/worlds")
          }}
          onCollection={() => router.push("/collections")}
        />
      </View>

      <NoAdsButton />
    </LinearGradient>
  )
}
