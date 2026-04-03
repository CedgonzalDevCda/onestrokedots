import { Stack } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { AdProvider } from "@/src/ads/AdProvider";
import * as SplashScreen from "expo-splash-screen";


export default function Layout() {

useEffect(() => {
  async function init() {
    try {
      await SplashScreen.preventAutoHideAsync();

      if (Platform.OS === "android") {
        await NavigationBar.setVisibilityAsync("hidden");
      }
    } catch (e) {
      console.log("Init error", e);
    } finally {
      await SplashScreen.hideAsync();
    }
  }

  init();
}, []);


  return (
    <>
      <StatusBar hidden />

      <AdProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(game)/worlds" />
          <Stack.Screen name="(game)/levels" />
          <Stack.Screen name="(game)/play" />
          <Stack.Screen name="(game)/settings" />
        </Stack>
      </AdProvider>
    </>
  );
}
