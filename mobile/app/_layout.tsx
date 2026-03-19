import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import mobileAds from "react-native-google-mobile-ads";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AdProvider } from "@/src/ads/AdProvider";

export default function Layout() {

  useEffect(() => {
    // ✅ Init AdMob
    mobileAds()
      .initialize()
      .then(() => {
        console.log("AdMob initialisé");
      });

    // ✅ Mode fullscreen Android
    if (Platform.OS === "android") {
      NavigationBar.setVisibilityAsync("hidden");
      NavigationBar.setBehaviorAsync("overlay-swipe");
    }

  }, []);

  return (
    <>
      {/* ✅ Cache la status bar */}
      <StatusBar hidden />

      {/* ✅ Ads globales */}
      <AdProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(game)/worlds" />
          <Stack.Screen name="(game)/levels" />
          <Stack.Screen name="(game)/play" />
        </Stack>
      </AdProvider>
    </>
  );
}
