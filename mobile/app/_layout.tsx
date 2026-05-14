import { Stack } from "expo-router";
import { useState, useEffect } from "react";
import { Platform, View, StyleSheet } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AdProvider } from "@/src/infrastructure/ads/AdProvider";
import * as SplashScreen from "expo-splash-screen";
import { initDatabase } from "@/src/infrastructure/persistence/sqlite/initDatabase";
import { progression } from "@/src/meta/progression/ProgressionService";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// ✅ SAFE AREA
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
          
          <StatusBar hidden />

          <AdProvider>
            <View style={styles.container}>
              
              {/* ✅ NAVIGATION */}
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(main)/home" />
                <Stack.Screen name="(game)/collections" />
                <Stack.Screen name="(game)/worlds" />
                <Stack.Screen name="(game)/levels/[worldId]" />
                <Stack.Screen name="(game)/play" />
                <Stack.Screen name="(game)/settings" />
              </Stack>

            </View>
          </AdProvider>

        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0F172A", // évite les bords blancs
  },

  container: {
    flex: 1,
  },

  bottomBanner: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    alignItems: "center",
  },
});
