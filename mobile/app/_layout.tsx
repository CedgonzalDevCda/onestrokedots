import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AdProvider } from "@/src/infrastructure/ads/AdProvider";
import * as SplashScreen from "expo-splash-screen";
import { initDatabase } from "@/src/infrastructure/persistence/sqlite/initDatabase";
import { progression } from "@/src/meta/progression/ProgressionService";

// ✅ AJOUT
import { GestureHandlerRootView } from "react-native-gesture-handler";

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

        setReady(true);
      } catch (e) {
        console.log("Init error", e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }

    init();
  }, []);

  if (!ready) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} testID="app-root">
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
    </GestureHandlerRootView>
  );
}
