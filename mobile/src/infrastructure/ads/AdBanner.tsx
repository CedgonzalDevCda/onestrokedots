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
  const { canLoadAd, adMode, adsReady } = useAds();

  const [showAd, setShowAd] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

const unitId = useMemo(() => {
  const config = adUnits.banner[placement];

  if (!config) return null;

  return Platform.select({
    ios: config.ios,
    android: config.android,
  });
}, [placement]);

if (!unitId) return null;


  // ✅ 1. PREMIER LOAD SAFE
  useEffect(() => {
    if (!adsReady) return;
    if (!canLoadAd()) return;

    const timer = setTimeout(() => {
      setShowAd(true);
    }, 2000); // ✅ délai obligatoire

    return () => clearTimeout(timer);
  }, [adsReady]);

  // ✅ 2. REFRESH SAFE (remplace setInterval)
  useEffect(() => {
    if (!showAd) return;

    const timer = setTimeout(() => {
      if (canLoadAd()) {
        setRefreshKey(prev => prev + 1);
      }
    }, adConfig.banner.refreshInterval);

    return () => clearTimeout(timer);
  }, [refreshKey, showAd]);

  // ✅ NO ADS MODE
  if (adMode === "no_ads") return null;

  // ✅ PAS PRÊT → fallback
  if (!showAd) {
    return <View style={styles.placeholder} />;
  }

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
    backgroundColor: "#000",
    paddingVertical: 4,
  },

  // ✅ évite layout jump + écran blanc
  placeholder: {
    width: "100%",
    height: 60,
    backgroundColor: "#000",
  },
});
