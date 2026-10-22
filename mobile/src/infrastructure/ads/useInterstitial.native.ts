import { useEffect, useRef } from "react";
import { InterstitialAd, AdEventType } from "react-native-google-mobile-ads";
import { Platform } from "react-native";
import { adUnits } from "./adUnits";

const adUnitId = Platform.select({
  ios: adUnits.interstitial.end_level.ios,
  android: adUnits.interstitial.end_level.android,
})!;

export function useInterstitial() {
  const interstitial = useRef<InterstitialAd | null>(null);
  const isLoaded = useRef(false);
  const onClosedRef = useRef<(() => void) | undefined>(undefined);

  useEffect(() => {
    // créer l'ad après le mount (évite un crash natif)
    const ad = InterstitialAd.createForAdRequest(adUnitId);
    interstitial.current = ad;

    const unsubscribeLoaded = ad.addAdEventListener(AdEventType.LOADED, () => {
      isLoaded.current = true;
    });

    const unsubscribeClosed = ad.addAdEventListener(AdEventType.CLOSED, () => {
      isLoaded.current = false;
      onClosedRef.current?.();
      onClosedRef.current = undefined;
      ad.load(); // rechargement automatique après fermeture
    });

    const unsubscribeError = ad.addAdEventListener(AdEventType.ERROR, () => {
      isLoaded.current = false;
      // si la pub échoue, on ne bloque pas le jeu
      onClosedRef.current?.();
      onClosedRef.current = undefined;
    });

    ad.load();

    return () => {
      unsubscribeLoaded();
      unsubscribeClosed();
      unsubscribeError();
    };
  }, []);

  function show(onClosed?: () => void) {
    if (isLoaded.current && interstitial.current) {
      onClosedRef.current = onClosed;
      interstitial.current.show();
    } else {
      // pas de pub prête : on continue directement
      onClosed?.();
    }
  }

  return { show };
}