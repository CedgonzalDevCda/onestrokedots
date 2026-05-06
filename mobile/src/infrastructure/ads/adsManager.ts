import mobileAds from "react-native-google-mobile-ads";

let initialized = false;

export async function initAdsSafe() {
  if (initialized) return true;

  try {
    await mobileAds().initialize();
    initialized = true;
    return true;
  } catch (e) {
    console.log("AdMob init failed", e);
    return false;
  }
}
