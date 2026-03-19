// ads/adUnits.ts
import { AdUnits } from "./types";

const FORCE_TEST_ADS = false;

const isSafeDev =
  __DEV__ ||
  process.env.NODE_ENV !== "production" ||
  FORCE_TEST_ADS;

const TEST_IDS = {
  banner: {
    ios: "ca-app-pub-3940256099942544/2934735716",
    android: "ca-app-pub-3940256099942544/6300978111",
  },
  interstitial: {
    ios: "ca-app-pub-3940256099942544/4411468910",
    android: "ca-app-pub-3940256099942544/1033173712",
  },
};

const realUnits = {
  banner: {
    home: {
      ios: "ca-app-pub-XXX/home-ios",
      android: "ca-app-pub-2062468514835599/4359072740/home-android",
    },
    world_list: {
      ios: "ca-app-pub-xxxx/yyyy",
      android: "ca-app-pub-2062468514835599/4359072740/world_list-android",
    },
    world_levels: {
      ios: "ca-app-pub-xxxx/yyyy",
      android: "ca-app-pub-2062468514835599/4359072740/world_levels-android",
    },
    gameOver: {
      ios: "ca-app-pub-XXX/gameover-ios",
      android: "ca-app-pub-2062468514835599/4359072740/gameover-android",
    },
  },
    interstitial: {
    end_level: {
      ios: "ca-app-pub-XXX/endlevel-ios",
      android: "ca-app-pub-2062468514835599/7342295473/endlevel-android",
    },
  },
};

// ✅ sécurité anti-erreur en prod
if (!isSafeDev) {
  const hasFakeId = JSON.stringify(realUnits).includes("XXX");
  if (hasFakeId) {
    throw new Error("❌ AdMob IDs non configurés pour la production");
  }
}

export const adUnits: AdUnits = {
  banner: {
    home: {
      ios: isSafeDev
        ? TEST_IDS.banner.ios
        : realUnits.banner.home.ios,
      android: isSafeDev
        ? TEST_IDS.banner.android
        : realUnits.banner.home.android,
    },
    world_list: {
      ios: isSafeDev
        ? TEST_IDS.banner.ios
        : realUnits.banner.world_list.ios,
      android: isSafeDev
        ? TEST_IDS.banner.android
        : realUnits.banner.world_list.android,
    },
    world_levels: {
      ios: isSafeDev
        ? TEST_IDS.banner.ios
        : realUnits.banner.world_levels.ios,
      android: isSafeDev
        ? TEST_IDS.banner.android
        : realUnits.banner.world_levels.android,
    },
    gameOver: {
      ios: isSafeDev
        ? TEST_IDS.banner.ios
        : realUnits.banner.gameOver.ios,
      android: isSafeDev
        ? TEST_IDS.banner.android
        : realUnits.banner.gameOver.android,
    },
  },

  interstitial: {
    end_level: {
      ios: isSafeDev
        ? TEST_IDS.interstitial.ios
        : realUnits.interstitial.end_level.ios,

      android: isSafeDev
        ? TEST_IDS.interstitial.android
        : realUnits.interstitial.end_level.android,
    },
  },
}

