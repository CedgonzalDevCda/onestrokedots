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

export type AdUnits = {
  banner: BannerPlacements;
  interstitial: InterstitialPlacements;
};
