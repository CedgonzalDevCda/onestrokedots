export type PlatformAdUnit = {
  ios: string;
  android: string;
};

export type BannerPlacements = {
  home: PlatformAdUnit;
  world_list: PlatformAdUnit;
  world_levels: PlatformAdUnit;
  gameOver: PlatformAdUnit;
};

export type InterstitialPlacements = {
  end_level: PlatformAdUnit;
};

// Typage strict : les clés sont désormais vérifiées par TypeScript
export type AdUnits = {
  banner: BannerPlacements;
  interstitial: InterstitialPlacements;
};

export type BannerPlacement = keyof BannerPlacements;
export type InterstitialPlacement = keyof InterstitialPlacements;

// Partagé entre AdProvider.native.tsx et AdProvider.web.tsx
export type AdMode = "normal" | "high" | "no_ads";

export type AdContextType = {
  adMode: AdMode;
  setAdMode: (mode: AdMode) => void;
  canLoadAd: () => boolean;
  adsReady: boolean;
};