import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AdProvider } from "@/src/ads/AdProvider";
import * as SplashScreen from "expo-splash-screen";
import { initDatabase } from "@/src/data/sources/local/sqlite/initDatabase"
import { progression } from "@/src/application/progression/ProgressionService"



export default function Layout() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function init() {
      try {
        await SplashScreen.preventAutoHideAsync();

        await initDatabase();
        await progression.init();

        if (Platform.OS === "android") {
          await NavigationBar.setVisibilityAsync("hidden");
        }

        setReady(true); // ✅ IMPORTANT
      } catch (e) {
        console.log("Init error", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    init();
  }, []);

  if (!ready) return null; // ✅ BLOQUE LE RENDU

  return (
    <>
      <StatusBar hidden />

      <AdProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(main)/home" />
          <Stack.Screen name="(game)/collections" />
          <Stack.Screen name="(game)/worlds" />
          <Stack.Screen name="(game)/levels/[worldId]" />
          <Stack.Screen name="(game)/play" />
          <Stack.Screen name="(game)/settings" />
        </Stack>
      </AdProvider>
    </>
  );
}
