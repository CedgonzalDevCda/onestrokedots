import { useEffect, useRef } from "react"
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from "react-native-google-mobile-ads"
import { Platform } from "react-native"
import { adUnits } from "./adUnits"

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : Platform.select({
      ios: adUnits.interstitial.end_level.ios,
      android: adUnits.interstitial.end_level.android,
    })!

export function useInterstitial() {
  const interstitial = useRef<InterstitialAd | null>(null)
  const isLoaded = useRef(false)

  useEffect(() => {
    // ✅ créer l’ad APRÈS mount (évite crash natif)
    const ad = InterstitialAd.createForAdRequest(adUnitId)
    interstitial.current = ad

    const unsubscribeLoaded = ad.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isLoaded.current = true
      }
    )

    const unsubscribeClosed = ad.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        isLoaded.current = false
        ad.load() // ✅ reload automatique après fermeture
      }
    )

    ad.load()

    return () => {
      unsubscribeLoaded()
      unsubscribeClosed()
    }
  }, [])

  function show() {
    if (isLoaded.current && interstitial.current) {
      interstitial.current.show()
    }
  }

  return { show }
}
