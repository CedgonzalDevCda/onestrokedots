import { useEffect, useRef } from "react"
import {
  InterstitialAd,
  AdEventType,
  TestIds
} from "react-native-google-mobile-ads"

const adUnitId = __DEV__
  ? TestIds.INTERSTITIAL
  : "ca-app-pub-2062468514835599/1040611006" // AdMob ID de l'interstitiel de fin de niveau (remplacez par votre propre ID en prod)

export function useInterstitial() {
  const interstitial = useRef(
    InterstitialAd.createForAdRequest(adUnitId)
  )

  const isLoaded = useRef(false)

  useEffect(() => {
    const unsubscribe = interstitial.current.addAdEventListener(
      AdEventType.LOADED,
      () => {
        isLoaded.current = true
      }
    )

    interstitial.current.load()

    return unsubscribe
  }, [])

  function show() {
    if (isLoaded.current) {
      interstitial.current.show()
      isLoaded.current = false
      interstitial.current.load() // 🔥 reload pour next time
    }
  }

  return { show }
}
