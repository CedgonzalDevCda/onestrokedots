// ads/AdBanner.tsx
import React, { useEffect, useState, useMemo } from "react";
import { View, Platform, StyleSheet } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { adUnits } from "./adUnits";
import { adConfig } from "./adConfig";
import { useAds } from "./AdProvider";

type Props = {
  placement: keyof typeof adUnits.banner;
};

export const AdBanner: React.FC<Props> = ({ placement }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const { canLoadAd, adMode } = useAds(); // ✅ récupère adMode

  const unitId = useMemo(() => {
    return Platform.select({
      ios: adUnits.banner[placement].ios,
      android: adUnits.banner[placement].android,
    })!;
  }, [placement]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canLoadAd()) {
        setRefreshKey(prev => prev + 1);
      }
    }, adConfig.banner.refreshInterval);

    return () => clearInterval(interval);
  }, [canLoadAd]);

  // ❌ no ads → rien
  if (adMode === "no_ads") return null;

  return (
    <View style={styles.container}>
      <BannerAd
        key={refreshKey}
        unitId={unitId}
        size={BannerAdSize.FULL_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#000", // ✅ évite flash blanc
    paddingVertical: 4,
  },
});
